# Video Production Agent - Quick Start Examples

This guide shows how to use the video production agent with the existing hiring-portfolio scripts.

## Example 1: Generate Video from EXECUTIVE_SUMMARY.md

The simplest usage - process the executive summary:

```bash
# Run with defaults (processes all .md files in docs/hiring-portfolio/)
./scripts/video-production-agent.sh
```

This will:
1. Find all markdown files in `docs/hiring-portfolio/`
2. Parse each script into scenes
3. Generate narration audio using espeak-ng
4. Create title card visuals for each scene
5. Assemble final MP4 videos
6. Save outputs to `video_output/`

Expected output:
```
video_output/
├── EXECUTIVE_SUMMARY.mp4
├── VIDEO_PRODUCTION_PACKAGE.mp4
├── QUICK_START.mp4
├── PRODUCTION_CHECKLIST.mp4
├── README.mp4
└── VIDEO_CONFIG_TEMPLATE.mp4
```

## Example 2: Generate Video for a Specific Script

To process only a specific script:

```bash
export SCRIPT_PATTERN="EXECUTIVE_SUMMARY.md"
./scripts/video-production-agent.sh
```

## Example 3: With Demo URL Capture

If you have a deployed demo, you can capture live footage:

```bash
export DEMO_URL="https://your-app-url.vercel.app"
export SCRIPT_PATTERN="VIDEO_PRODUCTION_PACKAGE.md"
./scripts/video-production-agent.sh
```

This will attempt to:
1. Launch a headless browser
2. Navigate to your demo URL
3. Capture interaction footage
4. Use the captured video as visuals for all scenes

## Example 4: High-Quality Output

For presentation or portfolio use:

```bash
export VIDEO_RESOLUTION="3840x2160"  # 4K
export FPS="60"
export VOICE_MODE="gtts"  # More natural voice (requires internet)
./scripts/video-production-agent.sh
```

## Example 5: Custom Script Directory

Process scripts from a different location:

```bash
export SCRIPT_DIR="path/to/your/scripts"
export SCRIPT_PATTERN="*.txt"
export VIDEO_OUT_DIR="custom_output"
./scripts/video-production-agent.sh
```

## Creating a Custom Script

Create a new script optimized for video production:

```bash
cat > docs/hiring-portfolio/CUSTOM_INTRO.md << 'EOF'
# Personal Introduction Video

### [00:00-00:15] Opening Hook

> Hi, I'm [Your Name], and I solve complex problems at the intersection of technology and business.

[ON SCREEN: Your name and title]

### [00:15-00:45] The Challenge

> When FTX collapsed, eight billion dollars vanished. I built a platform where that's impossible.

[VISUAL: Split screen - FTX headlines vs. secure architecture]

### [00:45-01:15] My Approach

> I designed a non-custodial trading platform. Users keep control of their funds. The interface is simple, but the architecture is bulletproof.

[ON SCREEN: Three-layer architecture diagram]

### [01:15-01:30] Call to Action

> If you need someone who thinks strategically and executes flawlessly, let's talk.

[ON SCREEN: Your contact information]
EOF
```

Then generate the video:

```bash
export SCRIPT_PATTERN="CUSTOM_INTRO.md"
./scripts/video-production-agent.sh
```

## Script Format Best Practices

### Use Timecodes for Precise Control

```markdown
### [00:00-00:30] Section Title
```

### Specify Visual Cues

```markdown
[ON SCREEN: Description of what should appear]
[VISUAL: Alternative description]
[SHOT 1: Camera instruction]
```

### Write Narration as Quotes

```markdown
> "Your spoken narration goes here. Keep it conversational and clear."
```

### Keep Scenes Focused

Each scene should:
- Have one main idea
- Be 15-30 seconds of narration
- Include at least one visual cue
- Flow logically to the next scene

## Troubleshooting Common Issues

### Issue: No audio generated

**Solution**: Check TTS installation
```bash
espeak-ng --version
# If not installed:
sudo apt-get install espeak-ng
```

### Issue: Video assembly fails

**Solution**: Verify FFmpeg
```bash
ffmpeg -version
# If not installed:
sudo apt-get install ffmpeg
```

### Issue: Out of memory

**Solution**: Process scripts one at a time
```bash
export SCRIPT_PATTERN="EXECUTIVE_SUMMARY.md"
./scripts/video-production-agent.sh

export SCRIPT_PATTERN="VIDEO_PRODUCTION_PACKAGE.md"
./scripts/video-production-agent.sh
```

### Issue: Poor audio quality

**Solution**: Try different TTS engine
```bash
# Install better TTS
sudo apt-get install festival festvox-kallpc16k

# Or use Google TTS (requires internet)
export VOICE_MODE="gtts"
./scripts/video-production-agent.sh
```

## Output Structure

After running the agent, you'll find:

```
video_output/
├── ScriptName.mp4           # Final video (ready to share)
├── audio/                   # Intermediate audio files
│   └── ScriptName_scene*.wav
├── visuals/                 # Intermediate visual files
│   └── ScriptName_scene*.png
└── logs/                    # Production logs
    ├── ScriptName_log.txt   # Detailed log for this script
    ├── production_summary.txt  # Human-readable summary
    └── production_summary.json # Structured data
```

## Integration with CI/CD

You can automate video generation in GitHub Actions:

```yaml
# .github/workflows/generate-videos.yml
name: Generate Portfolio Videos

on:
  push:
    paths:
      - 'docs/hiring-portfolio/*.md'

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y ffmpeg espeak-ng python3-pip
          pip3 install -r scripts/video_production/requirements.txt
      
      - name: Generate videos
        run: ./scripts/video-production-agent.sh
      
      - name: Upload videos
        uses: actions/upload-artifact@v4
        with:
          name: portfolio-videos
          path: video_output/*.mp4
```

## Next Steps

1. **Review existing scripts**: Check `docs/hiring-portfolio/` for content
2. **Run a test**: Generate one video to verify setup
3. **Customize**: Create your own intro/outro scripts
4. **Iterate**: Use logs to improve script content
5. **Share**: Use generated videos in job applications and portfolio

For more details, see:
- `scripts/video_production/README.md` - Full technical documentation
- `video_output/logs/production_summary.txt` - Recent run results
- Individual script logs for debugging specific issues
