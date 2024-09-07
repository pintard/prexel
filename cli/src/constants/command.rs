use strum_macros::Display;
use strum_macros::EnumString;

#[derive(Display, EnumString)]
#[strum(ascii_case_insensitive)]
pub enum Command {
    Config,
    Reset,
    Help,
    Create,
}