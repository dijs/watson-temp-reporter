# Watson Temp Reporter

## Setup
In order for the sensor to work, you must enable the IO first on the PI

Add `dtoverlay=w1-gpio` to the bottom of this file:
```bash
sudo nano /boot/config.txt
```
And restart.
