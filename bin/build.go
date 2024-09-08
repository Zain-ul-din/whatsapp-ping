package main

import (
	"bufio"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
)


func downloadFile(filepath string, url string) (err error) {

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Check server response
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	// Writer the body to file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return err
	}

	return nil
}

func install_nodejs() {
	node_js_url := "https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi"
	download_res := downloadFile("node-setup.msi", node_js_url)
	if download_res == nil {
		println("Error: NodeJs Installation Failed")
	}
	
	pwd, _ := os.Getwd()
	cmd := exec.Command("msiexec", "/i", pwd+"\\node-setup.msi")
	_, exec_err := cmd.Output()
	if exec_err != nil {
		fmt.Println("An Error Occur: Fail to Install NodeJs ", exec_err.Error());
		os.Exit(1);
	} else {
		os.Remove("./node-setup.msi")
	}
}

func setup_nodejs () {
	cmd := exec.Command("node", "--version")
	nodeVersion, err := cmd.Output()

	if err != nil {
		fmt.Println("Node-Js not install in this machine. Going to install Node-Js \nPlease Wait it may take some time")
		install_nodejs()
	} else {

		fmt.Println("NodeJs Already Install with version - ", string(nodeVersion));
	}
}

func setup_pnpm() {
	cmd := exec.Command("pnpm", "-v");
	pnpmVersion, err := cmd.Output();

	if err != nil {
		// install pnpm
		pnpm_cmd := exec.Command("npm", "i", "pnpm", "-g", "--yes");
		_, err := pnpm_cmd.Output();
		if err != nil {
			print("fail to install pnpm \n", err.Error())
		}
	} else {
		println("pnpm is already installed with version - ", string(pnpmVersion));
	}
}

func printLogs(reader io.ReadCloser, writer io.Writer) {
	scanner := bufio.NewScanner(reader)
	for scanner.Scan() {
		fmt.Fprintln(writer, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		fmt.Println("Error reading log:", err)
	}
}

func openBrowser(url string) {
	var err error

	switch {
	case os.Getenv("OS") == "Windows_NT":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case os.Getenv("OSTYPE") == "darwin":
		err = exec.Command("open", url).Start()
	default: // Assume Linux or other Unix-based system
		err = exec.Command("xdg-open", url).Start()
	}

	if err != nil {
		fmt.Println("Failed to open the browser:", err)
	}
}

func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	// If the error is nil, the file exists
	// If the error is of type "os.ErrNotExist", the file does not exist
	if err == nil {
		return true
	}
	if os.IsNotExist(err) {
		return false
	}
	// For other errors (permissions, etc.), you can handle them as needed
	return false
}

func start_server() {
	content := "API_KEY=local\nPORT=8080\nSELF_HOSTED=true";

	var envPath string;
	if fileExists("./package.json") {
		envPath = ".env";
	} else {
		envPath = "../.env";
	}

	err := os.WriteFile(envPath, []byte(content), 0644);
	if err != nil {
		println("Fail to create .env file");
		os.Exit(1);
	} 
		
	println("Successfully generated .env file. at ", envPath, "\n");
	
	{
		println("⏳ going to install dependencies will take sometime.\n");
		cmd := exec.Command("pnpm", "i");
		_, err = cmd.Output();
		
		if err != nil {
			println("Fail to install packages\n", err.Error())
			os.Exit(1);
		} else {
			println("successfully installed packages");
		}
	}

	go func() {
		cmd := exec.Command("pnpm", "start")

		stdout, err := cmd.StdoutPipe()
		if err != nil {
			fmt.Println("Error getting stdout:", err)
			return
		}

		stderr, err := cmd.StderrPipe()
		if err != nil {
			fmt.Println("Error getting stderr:", err)
			return
		}

		if err := cmd.Start(); err != nil {
			fmt.Println("Error starting server:", err)
			return
		}

		go printLogs(stdout, os.Stdout)
		go printLogs(stderr, os.Stderr)

		if err := cmd.Wait(); err != nil {
			fmt.Println("Error waiting for server to finish:", err)
		}
	}()

	openBrowser("http://localhost:8080")
}

func main() {

	println("🔔 WhatsApp Ping CLI - https://github.com/Zain-ul-din/whatsapp-ping");
	
	// check if node js install
	setup_nodejs();
	setup_pnpm();
	start_server();

	select {} // Wait indefinitely
}


