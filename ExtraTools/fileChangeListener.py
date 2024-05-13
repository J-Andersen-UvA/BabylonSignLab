import os
import socket
import time
import argparse

def send_message(filename, server_address, server_port):
    # Connect to the server
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((server_address, server_port))

    # Send the filename over the socket
    client_socket.sendall(filename.encode())

    # Close the socket
    client_socket.close()

def monitor_folder(folder_path, server_address, server_port):
    # Get the initial list of files in the folder
    initial_files = set(os.listdir(folder_path))

    while True:
        # Get the current list of files in the folder
        current_files = set(os.listdir(folder_path))

        # Find the new files that have been added
        new_files = current_files - initial_files

        # If there are new files, send a message for each one
        for filename in new_files:
            print("New file added to folder, sending message to " + str(server_address) + ":" + str(server_port) + "\t" + filename)
            send_message(filename, server_address, server_port)


        # Update the initial files list
        initial_files = current_files

        # Sleep for a short time before checking again
        time.sleep(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Monitor a folder for new files and send a message through a socket.")
    parser.add_argument("--current-dir", action="store_true", help="Monitor the current directory")
    parser.add_argument("--folder", type=str, help="Folder path to monitor")
    parser.add_argument("--server-address", type=str, default="localhost", help="Server address")
    parser.add_argument("--server-port", type=int, default=12345, help="Server port")

    args = parser.parse_args()

    if args.current_dir:
        folder_path = os.getcwd()  # Monitor the current directory
    elif args.folder:
        folder_path = args.folder  # Monitor the specified directory
    else:
        parser.print_help()
        exit()

    print("Monitoring folder:", folder_path, "\tServer address:", args.server_address, "\tServer port:", args.server_port)
    monitor_folder(folder_path, args.server_address, args.server_port)


# USES:
# python script.py --current-dir --server-address example.com --server-port 12345
# python script.py --folder /path/to/your/directory --server-address example.com --server-port 12345
