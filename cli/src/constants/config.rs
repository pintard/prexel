use serde::{Deserialize, Serialize};
use super::esc_seq::EscSeq;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum UptimeFormat {
    Days,
    Hours,
    Colon,
    None,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum MemoryFormatDisplay {
    Percent,
    Values,
    Both,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum MemoryFormatMetric {
    GB,
    MiB,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Display {
    pub should_display_image: bool,
    pub should_display_blocks: bool,
    pub should_display_text: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Alignment {
    pub space_before: usize,
    pub space_after: usize,
    pub lines_before: usize,
    pub lines_after: usize,
    pub hr_node_repeat: usize,
    pub word_wrap: usize,
    pub color_block_padding: usize,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BulletChar {
    pub hr_divider_node: Option<u32>,
    pub default_bullet: u32,
    pub sys_distro_bullet: Option<u32>,
    pub sys_shell_bullet: Option<u32>,
    pub current_date_time_bullet: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TextColor {
    pub default_text_color: EscSeq,
    pub username_color: EscSeq,
    pub device_name_color: EscSeq,
    pub welcome_message_color: EscSeq,
    pub hr_color: EscSeq,
    // Bullet Colors
    pub default_bullet_color: EscSeq,
    pub sys_distro_bullet_color: EscSeq,
    pub sys_shell_bullet_color: EscSeq,
    pub current_date_time_bullet_color: EscSeq,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Override {
    pub username_override: Option<String>,
    pub device_name_override: Option<String>,
    pub sys_distro_override: Option<String>,
    pub sys_shell_override: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Formats {
    pub current_date_time_format: String,
    // pub uptime_format: UptimeFormat,
    // pub cpu_memory_format: (MemoryFormatDisplay, MemoryFormatMetric),
    // pub ram_memory_format: (MemoryFormatDisplay, MemoryFormatMetric),
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Details {
    pub welcome_message: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub formats: Formats,
    pub displays: Display,
    pub alignments: Alignment,
    pub chars: BulletChar,
    pub colors: TextColor,
    pub overrides: Override,
    pub details: Details,
}
