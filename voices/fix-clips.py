"""Finds voice clips where the voice kept talking after the line ended (a known glitch with designed voices),
and trims each one right after the last real word. Free: runs on GitHub's machines, no voice credits.

How: a clip much longer than its text should take is "suspect". Suspect clips are transcribed with
Whisper (word timings), and the clip is cut after the Nth word, N = number of words in the line.
The trimmed clip gets a new name ending in -t.mp3 so tablets fetch the new file.

Run:  python3 voices/fix-clips.py          (installs faster-whisper the first time it finds a suspect clip)
      python3 voices/fix-clips.py --check  (only lists suspect clips)
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.join(HERE, '..', 'app', 'audio')
SPEEDS = {'slow': .75, 'calm': .88, 'normal': 1.0}


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                         capture_output=True, text=True).stdout.strip()
    return float(out or 0)


def expected(key):
    who, speed, text = key.split('|', 2)
    return (0.35 + len(text.replace(' ', '')) * 0.085) / SPEEDS.get(speed, 1)


def main():
    index_file = os.path.join(AUDIO, 'index.json')
    index = json.load(open(index_file, encoding='utf8'))
    suspects = []
    for key, f in index.items():
        if f.endswith('-t.mp3'):
            continue
        path = os.path.join(AUDIO, f)
        if not os.path.exists(path):
            continue
        d, e = duration(path), expected(key)
        if d > 1.7 * e + 0.4:
            suspects.append((key, f, d, e))
    print(f'{len(suspects)} clip(s) run on after the line ends.')
    if not suspects or '--check' in sys.argv:
        for key, f, d, e in suspects:
            print(f'  {d:5.2f}s (expected about {e:.2f}s)  {key}')
        return

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'faster-whisper'], check=True)
        from faster_whisper import WhisperModel
    model = WhisperModel('small', device='cpu', compute_type='int8')

    fixed = 0
    for key, f, d, e in suspects:
        text = key.split('|', 2)[2]
        n = len(text.split())
        path = os.path.join(AUDIO, f)
        segs, _ = model.transcribe(path, language='ar', word_timestamps=True, initial_prompt=text,
                                   vad_filter=False, condition_on_previous_text=False)
        words = [w for s in segs for w in (s.words or [])]
        if len(words) >= n:
            cut = words[n - 1].end + 0.15
        else:
            cut = 1.3 * e   # Whisper heard too little: keep a safe amount
        cut = max(cut, 0.6 * e, 0.45)
        if cut >= d - 0.1:
            print(f'  kept as is: {key}')
            continue
        new = f[:-4] + '-t.mp3'
        subprocess.run(['ffmpeg', '-v', 'quiet', '-y', '-i', path, '-t', f'{cut:.2f}',
                        '-af', f'afade=t=out:st={max(cut - 0.08, 0):.2f}:d=0.08', '-b:a', '64k',
                        os.path.join(AUDIO, new)], check=True)
        os.remove(path)
        index[key] = new
        fixed += 1
        heard = ' '.join(w.word.strip() for w in words[:n + 3])
        print(f'  {d:5.2f}s -> {cut:4.2f}s  {key}   (heard: {heard} ...)')
    json.dump(index, open(index_file, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print(f'Trimmed {fixed} clip(s).')


if __name__ == '__main__':
    main()
