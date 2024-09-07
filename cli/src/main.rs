// #![allow(unused)]
mod commands;
mod constants;
mod extensions;
mod utils;

use commands::{base, config, create, help, reset};
use constants::command::Command::{self, Config, Create, Help, Reset};

use std::env;
use std::str::FromStr;
use strum::ParseError;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() > 1 {
        let command_str: &str = args[1].as_str();
        let command: Result<Command, ParseError> = Command::from_str(command_str);
        match command {
            Ok(Config) => config::config_command(),
            Ok(Reset) => reset::reset_command(),
            Ok(Create) => create::create_command(),
            Ok(Help) => help::help_command(),
            Err(_) => println!("Command not found: '{command_str}'"),
        };
    } else {
        base::base_command();
    }
}
