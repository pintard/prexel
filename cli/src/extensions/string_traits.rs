use std::str::SplitWhitespace;

use crate::constants::esc_seq::EscSeq::{self, End};

pub trait TextHandling {
    fn split_at_closest(&self, idx: u8) -> (String, String);
    fn colorize(&self, color: EscSeq) -> String;
}

impl TextHandling for String {
    fn split_at_closest(&self, idx: u8) -> (String, String) {
        let mut str: String = String::from(&self.clone());
        let mut aggr: String = String::new();
        if str.len() as u8 > idx {
            while (aggr.len() as u8) < idx {
                let mut iter: SplitWhitespace = str.split_whitespace();
                let word: &str = iter.next().unwrap();
                let chunk: &str = &(word.to_owned() + " ");
                aggr.push_str(chunk);
                str = iter.map(|x| x.to_owned() + " ").collect::<String>();
            }
        } else {
            aggr = str;
            str = String::from("");
        }
        (aggr, str)
    }

    fn colorize(&self, color: EscSeq) -> String {
        format!("{}{}{}", color, self, End)
    }
}
