use std::{
    env::current_dir,
    io::stdin,
    process::{Command, Stdio},
};

use crate::{constants::esc_seq::EscSeq, extensions::string_traits::TextHandling};

pub fn config_command() -> () {
    let config_path: String = current_dir()
        .unwrap()
        .join("src/configs/.config.yaml")
        .to_str()
        .unwrap()
        .to_string();

    handle_config(config_path);
}

fn handle_config(file_path: String) -> () {
    loop {
        let prompt_message = String::from(
            "Do you want to open the configuration file in Vim or Nano?\n\
            Enter [V/v] for Vim or [N/n] for Nano:",
        )
        .colorize(EscSeq::Yellow);
        println!("{prompt_message}");

        let mut choice: String = String::new();
        stdin().read_line(&mut choice).expect("Failed to read line");

        match choice.trim() {
            "V" | "v" => {
                open_file(file_path, "vim");
                break;
            }
            "N" | "n" => {
                open_file(file_path, "nano");
                break;
            }
            _ => {
                let err_message: String =
                    String::from("Invalid choice. Please enter V or N.\n").colorize(EscSeq::Red);
                println!("{err_message}");
            }
        }
    }
}

fn open_file(file_path: String, editor: &str) {
    let status = Command::new(editor)
        .arg(file_path)
        .stdin(Stdio::inherit())
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status()
        .expect("Failed to execute command");

    if status.success() {
        let success_message: String = format!("File opened in {}.", editor).colorize(EscSeq::Green);
        println!("{success_message}");
    } else {
        let err_message: String =
            format!("Failed to open file in {}.", editor).colorize(EscSeq::Red);
        println!("{err_message}");
    }
}
