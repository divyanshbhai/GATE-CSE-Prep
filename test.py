import yt_dlp
import json
import re

# ✅ Subject playlists
playlists = {
    "Databases": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y",
    "Computer Networks": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_",
    "Algorithms": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiHcmS4i14bI0VrMbZTUvlTa",
    "Theory of Computation": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFM9Lj5G9G_76adtyb4ef7i",
    "Digital Logic": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGmXg4NoX6R31AsC5LeCPHe",
    "Operating Systems": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p",
    "Compiler Design": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEKtKSIHYusizkESC42diyc",
    "Computer Organization and Architecture": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX",
    "Discrete Mathematics": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiH2wwES9vPWsEL6ipTaUSl3"
}

# ✅ yt-dlp options
ydl_opts = {
    'quiet': True,
    'no_warnings': True,
    'extract_flat': True,
}

def guess_topic(title):
    """Extracts a meaningful topic keyword from the video title."""
    title = re.sub(r'\|.*', '', title)  # Remove anything after '|'
    title = re.sub(r'[^a-zA-Z0-9\s]', '', title)  # Remove special chars
    words = title.strip().split()
    # Return 2-3 main words (heuristic)
    return ' '.join(words[:3]) if len(words) > 2 else title.strip()

videos = []
id_counter = {}

for subject, playlist_url in playlists.items():
    print(f"\n🎥 Fetching playlist for {subject}...")
    prefix = ''.join([w[0].lower() for w in subject.split() if w.isalpha()])[:2]

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(playlist_url, download=False)
            entries = info.get('entries', [])

            for i, video in enumerate(entries, start=1):
                video_id = video.get('id')
                title = video.get('title', 'Untitled')
                duration = video.get('duration')
                duration_str = f"{duration//60}:{duration%60:02d}" if duration else "N/A"
                thumbnail = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"

                id_counter[subject] = id_counter.get(subject, 0) + 1
                custom_id = f"{prefix}{id_counter[subject]}"

                videos.append({
                    "id": custom_id,
                    "videoId": video_id,
                    "title": title,
                    "topic": guess_topic(title),
                    "subject": subject,
                    "duration": duration_str,
                    "thumbnail": thumbnail
                })

            print(f"✅ {len(entries)} videos added for {subject}")

        except Exception as e:
            print(f"❌ Error fetching {subject}: {e}")

# ✅ Write to JSON file
final_output = {"videos": videos}

with open("videos.json", "w", encoding="utf-8") as f:
    json.dump(final_output, f, indent=2, ensure_ascii=False)

print(f"\n🎉 Successfully created videos.json with {len(videos)} videos!")
