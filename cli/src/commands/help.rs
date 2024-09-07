use std::{env::current_dir, fs::read_to_string, path::PathBuf};

pub fn help_command() {
    let help_file_path: PathBuf = current_dir().unwrap().join("src/configs/.help");
    println!(
        "{}",
        read_to_string(help_file_path).expect("Unable to read file")
    );
}
