use std::process::{Command, Output};

pub fn get_shell_version(shell: String) -> Option<String> {
    Command::new(shell)
        .arg("--version")
        .output()
        .ok()
        .and_then(|output: Output| {
            if output.status.success() {
                Some(String::from_utf8_lossy(&output.stdout).trim_end().to_string())
            } else {
                None
            }
        })
}
