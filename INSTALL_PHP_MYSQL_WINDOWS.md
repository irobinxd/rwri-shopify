# Installing PHP and MySQL for Laravel on Windows

## Option 1: Laragon (Recommended for Laravel)

Laragon is specifically designed for Laravel development on Windows and includes:
- PHP 8.2+ (multiple versions available)
- MySQL/MariaDB
- Apache/Nginx
- Composer
- Git
- Node.js

### Installation Steps:

1. **Download Laragon:**
   - Visit: https://laragon.org/download/
   - Download the latest version (Full version recommended)

2. **Install Laragon:**
   - Run the installer
   - Choose installation directory (default: `C:\laragon`)
   - During installation, select:
     - PHP 8.2 or 8.3
     - MySQL 8.0
     - Apache (or Nginx if preferred)
     - Composer
     - Git

3. **Start Laragon:**
   - Launch Laragon
   - Click "Start All" to start Apache and MySQL

4. **Verify Installation:**
   ```powershell
   php --version
   mysql --version
   composer --version
   ```

5. **Add to PATH (if needed):**
   - Laragon usually adds PHP and MySQL to PATH automatically
   - If not, add these to your system PATH:
     - `C:\laragon\bin\php\php-8.2.x` (or php-8.3.x)
     - `C:\laragon\bin\mysql\mysql-8.x.x\bin`
   - **To add via PowerShell (run as Administrator):**
     ```powershell
     # Add PHP to PATH
     $phpPath = "C:\laragon\bin\php\php-8.3.28-Win32-vs16-x64"
     [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$phpPath", [EnvironmentVariableTarget]::User)
     
     # Add MySQL to PATH
     $mysqlPath = "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin"
     [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$mysqlPath", [EnvironmentVariableTarget]::User)
     ```
   - **Restart PowerShell/Command Prompt** after adding to PATH

6. **Install Laragon as Windows Service (Auto-start on boot):**
   
   Laragon can run Apache and MySQL as Windows services so they start automatically when Windows boots.
   
   **Method 1: Using Laragon GUI (Easiest)**
   - Open Laragon
   - Right-click on the Laragon icon in the system tray
   - Go to **Menu** → **Services** → **Install as Service**
   - Select **Apache** and/or **MySQL**
   - Services will be installed and set to start automatically
   
   **Method 2: Using Command Line (Run as Administrator)**
   ```powershell
   # Install Apache as service
   & "C:\laragon\bin\apache\apache-2.4.x\bin\httpd.exe" -k install -n "LaragonApache"
   
   # Install MySQL as service
   & "C:\laragon\bin\mysql\mysql-8.x.x\bin\mysqld.exe" --install "LaragonMySQL"
   
   # Start services
   Start-Service LaragonApache
   Start-Service LaragonMySQL
   
   # Set services to auto-start
   Set-Service -Name LaragonApache -StartupType Automatic
   Set-Service -Name LaragonMySQL -StartupType Automatic
   ```
   
   **Method 3: Using Services Manager**
   - Press `Win + R`, type `services.msc`, press Enter
   - Look for "LaragonApache" and "LaragonMySQL" services
   - Right-click each service → Properties
   - Set **Startup type** to **Automatic**
   - Click **Start** if not already running
   
   **Note:** If you install as services, you don't need to manually start Laragon each time. The services will run in the background.

---

## Option 2: XAMPP

XAMPP includes Apache, MySQL, PHP, and phpMyAdmin.

### Installation Steps:

1. **Download XAMPP:**
   - Visit: https://www.apachefriends.org/download.html
   - Download XAMPP for Windows (includes PHP 8.2)

2. **Install XAMPP:**
   - Run installer
   - Choose components: Apache, MySQL, PHP, phpMyAdmin
   - Install to `C:\xampp` (or your preferred location)

3. **Start Services:**
   - Open XAMPP Control Panel
   - Start Apache and MySQL

4. **Add PHP to PATH:**
   - Add `C:\xampp\php` to your system PATH
   - Restart PowerShell/Command Prompt

---

## Option 3: Individual Installations

### Install PHP 8.2:

1. **Download PHP:**
   - Visit: https://windows.php.net/download/
   - Download PHP 8.2 Thread Safe ZIP

2. **Extract PHP:**
   - Extract to `C:\php`
   - Copy `php.ini-development` to `php.ini`
   - Edit `php.ini` and uncomment:
     ```
     extension=mysqli
     extension=pdo_mysql
     extension=mbstring
     extension=openssl
     extension=curl
     extension=fileinfo
     extension=zip
     ```

3. **Add to PATH:**
   - Add `C:\php` to system PATH

### Install MySQL:

1. **Download MySQL:**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Download MySQL Installer for Windows

2. **Install MySQL:**
   - Run installer
   - Choose "Developer Default" or "Server only"
   - Set root password (remember this!)
   - Complete installation

3. **Add to PATH:**
   - MySQL usually adds itself to PATH automatically
   - If not, add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

---

## After Installation - Configure Laravel

1. **Navigate to your Laravel project:**
   ```powershell
   cd rwri-portal
   ```

2. **Copy .env file:**
   ```powershell
   copy .env.example .env
   ```

3. **Edit .env file** and configure database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=rwri_portal
   DB_USERNAME=root
   DB_PASSWORD=your_mysql_password
   ```

4. **Create database:**
   ```sql
   CREATE DATABASE rwri_portal;
   ```

5. **Install dependencies:**
   ```powershell
   composer install
   ```

6. **Generate application key:**
   ```powershell
   php artisan key:generate
   ```

7. **Run migrations:**
   ```powershell
   php artisan migrate
   ```

---

## Quick Test Commands

After installation, test in PowerShell:

```powershell
# Check PHP version (should be 8.2+)
php --version

# Check MySQL version
mysql --version

# Check Composer
composer --version

# Test PHP extensions
php -m | findstr -i "mysqli pdo_mysql mbstring"
```

---

## Troubleshooting

### PHP not found:
- **Restart PowerShell/Command Prompt** after adding to PATH (this is required!)
- Check if PHP is in PATH: `$env:PATH -split ';' | Select-String php`
- Verify PHP exists: `Test-Path "C:\laragon\bin\php\php-8.3.28-Win32-vs16-x64\php.exe"`
- If still not found, manually add to PATH via System Properties:
  1. Press `Win + X` → **System** → **Advanced system settings**
  2. Click **Environment Variables**
  3. Under **User variables**, select **Path** → **Edit**
  4. Add: `C:\laragon\bin\php\php-8.3.28-Win32-vs16-x64`
  5. Click **OK** on all dialogs
  6. **Close and reopen PowerShell**

### MySQL connection refused:
- Ensure MySQL service is running:
  ```powershell
  Get-Service | Where-Object {$_.Name -like "*mysql*" -or $_.Name -like "*laragon*"}
  ```
- Start MySQL service:
  ```powershell
  Start-Service LaragonMySQL
  # Or if using Laragon GUI, click "Start All"
  ```
- Check if port 3306 is available: `netstat -an | findstr 3306`
- Verify credentials in .env file
- Default MySQL root password in Laragon is usually **empty (blank)**

### Laragon Services Not Starting:
- Check if services are installed:
  ```powershell
  Get-Service | Where-Object {$_.Name -like "*laragon*"}
  ```
- If services don't exist, install them using Method 2 above (run PowerShell as Administrator)
- Check service logs in Event Viewer if services fail to start

### Composer not found:
- Laragon includes Composer, but it may not be in PATH
- Add to PATH: `C:\laragon\bin\composer`
- Or install Composer separately: https://getcomposer.org/download/

