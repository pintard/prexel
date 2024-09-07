use open::that;

pub fn create_command() {
    let create_sandbox_url: &str = "https://www.google.com";

    match that(create_sandbox_url) {
        Ok(_) => println!("Opening {} in the default browser.", create_sandbox_url),
        Err(e) => println!("Failed to open the default browser: {}", e),
    }
}
