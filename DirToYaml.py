# #!/usr/bin/python
'''
This is a python script to convert a directory traversal into a YAML markup.
Each file should have the following format:
{
    "name": [WEBSITE NAME]",
    "type": "url",
    "url": "[WEBSITE URL]",
    "description": "[WEBSITE DESCRIPTION]"
}
'''

import os
# Function to print the file contents of each file in the Directory Tree
def print_files(files,path):
    countFiles = 0
    for file in files:
        filePath = path+'/'+file
        with open(filePath, 'r') as fileobj:
        # text = fileobj.read()
        # print(text)
            print('{')
            print('"name":"'+file+'",') 
            print('"type": "url",')
            print('"url":"'+filePath[1:]+'"')  
            # print('"description": "[WEBSITE DESCRIPTION]"')
            print('}')
        # if its the last file, dont print a comma
        if(countFiles != len(files)-1): 
            print(",")
            countFiles+=1    

# Function to print a closing statement that continues
def print_closer():
    print(']')
    print('}')
    print(',')

# Function to print a closing statement that ends
def printEndCloser():
    print(']')
    print('}')

# Main Function to traverse the tree
def main():
    stack = []
    currStack = 0
    for root, dirs, files in os.walk('./public/arsenal/arsenal/data/cheats'):
        # Remove all hidden files
        files = [x for x in files if not x.startswith('.')] 
        
        # print the header information for a Folder
        print('{')
        print('"name": "'+os.path.basename(root)+'",')
        print('"type": "Folder",')
        print('"children": [')

        #Get the File Path
        path = root.split(os.sep)
        path = '/'.join(path)

        print_files(files,path)
        # If there are folders within the file, append to stack
        if len(dirs)!=0: 
            stack.append(currStack)
            currStack = len(dirs)
            # If there are also files in the folder, make it continous
            if len(files) != 0:
                print(",")
        else:
            # Decrement current stack count of Folders
            currStack -= 1
            if(currStack==0): 
                # While Stack of current folders is empty, pop stack of closing statements
                while currStack == 0:
                    printEndCloser()
                    currStack = stack.pop()
                    currStack -= 1
                    
                # If its the stack is empty
                if (currStack != -1):
                    print_closer()
                else:
                    printEndCloser()
            else:
                print_closer()

if __name__ == "__main__":
    main()