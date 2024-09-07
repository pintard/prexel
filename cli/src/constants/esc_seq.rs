use std::fmt;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum EscSeq {
    Black,
    Red,
    Green,
    Yellow,
    Blue,
    Magenta,
    Cyan,
    White,
    LightBlack,
    LightRed,
    LightGreen,
    LightYellow,
    LightBlue,
    LightMagenta,
    LightCyan,
    LightWhite,
    Bold,
    Italic,
    Underline,
    End,
}

impl EscSeq {
    fn to_code(&self) -> &str {
        match self {
            EscSeq::Black => "\x1b[30m",
            EscSeq::Red => "\x1b[31m",
            EscSeq::Green => "\x1b[32m",
            EscSeq::Yellow => "\x1b[33m",
            EscSeq::Blue => "\x1b[34m",
            EscSeq::Magenta => "\x1b[35m",
            EscSeq::Cyan => "\x1b[36m",
            EscSeq::White => "\x1b[37m",
            EscSeq::LightBlack => "\x1b[90m",
            EscSeq::LightRed => "\x1b[91m",
            EscSeq::LightGreen => "\x1b[92m",
            EscSeq::LightYellow => "\x1b[93m",
            EscSeq::LightBlue => "\x1b[94m",
            EscSeq::LightMagenta => "\x1b[95m",
            EscSeq::LightCyan => "\x1b[96m",
            EscSeq::LightWhite => "\x1b[97m",
            EscSeq::Bold => "\x1b[1m",
            EscSeq::Italic => "\x1b[3m",
            EscSeq::Underline => "\x1b[4m",
            EscSeq::End => "\x1b[0m",
        }
    }
}

impl fmt::Display for EscSeq {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.to_code())
    }
}
