"""Finds voice clips where the voice kept talking before or after the line (a known glitch with designed voices),
and keeps only the part where the line is actually said. Free: runs on GitHub's machines, no voice credits.

How: a clip much longer than its text should take is "suspect". Suspect clips are transcribed with Whisper
(word timings). The run of heard words that best matches the line's text is found, and the clip is cut to it.
If nothing matches well enough the clip is left alone. Trimmed clips get a new name ending in -t.mp3 so tablets
fetch the new file. Every decision is written to voices/fix-report.txt.

Run:  python3 voices/fix-clips.py          (installs faster-whisper the first time it finds a suspect clip)
      python3 voices/fix-clips.py --check  (only lists suspect clips)
"""
import difflib, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
AUDIO = os.path.join(HERE, '..', 'app', 'audio')
REPORT = os.path.join(HERE, 'fix-report.txt')
SPEEDS = {'slow': .75, 'calm': .88, 'normal': 1.0}


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', path],
                         capture_output=True, text=True).stdout.strip()
    return float(out or 0)


def expected(key):
    who, speed, text = key.split('|', 2)
    return (0.35 + len(text.replace(' ', '')) * 0.085) / SPEEDS.get(speed, 1)


def norm(s):
    s = re.sub('[ً-ْٰـ]', '', s)          # harakat, tatweel
    s = re.sub('[أإآٱ]', 'ا', s).replace('ة', 'ه').replace('ى', 'ي')
    return re.sub(r'[^ء-ي ]', '', s).strip()


def best_window(target, words):
    """(score, i, j): the run words[i:j] whose text is closest to the target."""
    t = norm(target).replace(' ', '')
    n = len(target.split())
    best = (0, 0, 0)
    for i in range(len(words)):
        for j in range(i + 1, min(len(words), i + n + 3) + 1):
            h = ''.join(norm(w.word) for w in words[i:j])
            if not h:
                continue
            score = difflib.SequenceMatcher(None, t, h).ratio()
            if score > best[0]:
                best = (score, i, j)
    return best


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
    print(f'{len(suspects)} clip(s) may run on before or after the line.')
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

    report, fixed = [], 0
    for key, f, d, e in suspects:
        text = key.split('|', 2)[2]
        path = os.path.join(AUDIO, f)
        segs, _ = model.transcribe(path, language='ar', word_timestamps=True, vad_filter=False,
                                   condition_on_previous_text=False, beam_size=5)
        words = [w for s in segs for w in (s.words or [])]
        heard = ' '.join(w.word.strip() for w in words)
        score, i, j = best_window(text, words) if words else (0, 0, 0)
        if score < 0.6:
            report.append(f'LEFT   {d:5.2f}s  match {score:.2f}  {key}\n       heard: {heard}')
            continue
        start = max(words[i].start - 0.12, 0)
        end = min(words[j - 1].end + 0.2, d)
        if end - start >= d - 0.3:
            report.append(f'OK     {d:5.2f}s  match {score:.2f}  {key}\n       heard: {heard}')
            continue
        new = f[:-4] + '-t.mp3'
        length = end - start
        subprocess.run(['ffmpeg', '-v', 'quiet', '-y', '-ss', f'{start:.2f}', '-i', path, '-t', f'{length:.2f}',
                        '-af', f'afade=t=in:d=0.03,afade=t=out:st={max(length - 0.08, 0):.2f}:d=0.08', '-b:a', '64k',
                        os.path.join(AUDIO, new)], check=True)
        os.remove(path)
        index[key] = new
        fixed += 1
        report.append(f'TRIM   {d:5.2f}s -> {start:.2f}..{end:.2f}s  match {score:.2f}  {key}\n'
                      f'       kept: {" ".join(w.word.strip() for w in words[i:j])}\n       heard: {heard}')
    json.dump(index, open(index_file, 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    open(REPORT, 'w', encoding='utf8').write('\n'.join(report) + '\n')
    print('\n'.join(report))
    print(f'Trimmed {fixed} clip(s).')


if __name__ == '__main__':
    try:
        main()
    except Exception:   # never block publishing: report it (shows on GitHub as a warning) and carry on
        import traceback
        msg = traceback.format_exc().strip().splitlines()
        print('::warning title=fix-clips::' + ' | '.join(msg[-4:]))
        print('\n'.join(msg))
