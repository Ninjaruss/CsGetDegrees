# Credentials Folder

## Required items, in order of listing in below instructions

1. Server IP: 34.94.123.246
2. SSH Username: aramisknox
3. SSH Key: The file containing the ssh key is in this directory and is called "id_rsa.pub"
4. Database IP: Using localhost (34.94.123.246)
5. Database Port: 3306
6. Database Username: root
7. Database Password: CsGetDegrees648
8. Database Name: CsGetDegrees
9. **SSH Instructions:**
   * To ssh into the server, you must run the command: 
   ```
   ssh -i "[PATH_TO_FILE_CONTAINING_SSH_KEY]" [USERNAME]@[IP_ADDRESS]
   ```
   * Create a copy of the file in this directory containing the key (csc648website_laptop.pub) on your machine
   * In the above command, replace the following placeholders as follows:
     * Replace [PATH_TO_FILE_CONTAINING_SSH_KEY] with the path on your machine to your copy of the file (leave the quotes around the path)
     * Replace [USERNAME] with aramisknox
     * Replace [IP_ADDRESS] with 34.94.123.246
   * Example:
     ```
     ssh -i "~/.ssh/id_rsa" aramisknox@34.94.123.246
     ```
   **Ubuntu Root User Instructions:**
   * To log in as root, first SSH into the server
   * Once in the server, run the command: su -
   * Once prompted for a password, enter: CsGetDegrees648
   * This should successfully log you in as the root user
   
   **MySQL Log In Instructions:**
   * To log into MySQL, run the command: mysql -u root -p
   * When prompted for a password, enter: CsGetDegrees648
