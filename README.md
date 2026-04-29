# Hackatime Stats

Show your Hackatime streak directly in the VS Code status bar.
(I will add more stats in future)

## Features
- Status bar item with streak text
- Command: `Hackatime: Show Streak`
- Friendly fallback when no streak is available

## Usage
1. Run command `Hackatime: Show Streak`or you can click on this shown below <br><br>
![test image](images/screenshot-2026-04-29-151340.png)
<br>

2. Enter your Hackatime username
<br>
![test image](images/screenshot-2026-04-29-151134.png)

3. View streak in popup and status bar


## API Used
- `GET https://hackatime.hackclub.com/api/v1/users/{username}/stats`

## Notes
- No API key required in this version
- If user is not found, the extension shows an error message

## This is some Images


![test image](images/screenshot-2026-04-29-144441.png)

![test image](images/screenshot-2026-04-29-144422.png)

