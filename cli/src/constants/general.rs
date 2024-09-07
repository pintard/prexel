use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use strum_macros::Display;

#[derive(Debug, Serialize, Deserialize, Display, PartialEq)]
pub enum BlockType {
    Light,
    Normal,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct BaseDetails {
    pub normal_blocks: String,
    pub light_blocks: String,
    pub message: Vec<String>,
    pub details: HashMap<DetailKey, String>,
}

#[derive(Debug, Serialize, Deserialize, Display, PartialEq, Eq, Hash)]
pub enum DetailKey {
    Username,
    DeviceName,
    SysDistro,
    SysShellVersion,
    CurrentDateTime,
}
