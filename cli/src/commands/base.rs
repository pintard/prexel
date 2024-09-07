use chrono::Local;
use regex::Regex;
use std::{
    cmp,
    collections::HashMap,
    env::{current_dir, var},
    fs::{read_to_string, File},
    path::PathBuf,
};
use whoami;

use crate::{
    constants::{
        config::{Alignment, BulletChar, Config, Details, Display, Formats, Override, TextColor},
        esc_seq::EscSeq::End,
        general::{
            BaseDetails, BlockType,
            DetailKey::{self, CurrentDateTime, DeviceName, SysDistro, SysShellVersion, Username},
        },
    },
    extensions::{integer_traits::IntegerHandling, string_traits::TextHandling},
    utils::general::get_shell_version,
};

pub fn base_command() {
    let config_path: PathBuf = current_dir().unwrap().join("src/configs/.config.yaml");
    let config_file: File = File::open(config_path).expect("Unable to open file");
    let config: Config = serde_yaml::from_reader(config_file).expect("Unable to read yaml");

    let cute_path: PathBuf = current_dir().unwrap().join("src/configs/.cute");
    let cute_img: String = read_to_string(cute_path).expect("Unable to read text");

    let base_details: BaseDetails = generate_base_details(config.clone());
    print_base_details(config, base_details, cute_img);
}

fn generate_base_details(config: Config) -> BaseDetails {
    let Alignment {
        word_wrap,
        color_block_padding,
        ..
    } = config.alignments;

    let TextColor {
        username_color,
        device_name_color,
        default_text_color,
        ..
    } = config.colors;

    let Formats {
        current_date_time_format,
        ..
    } = config.formats;

    let Details {
        welcome_message, ..
    } = config.details;

    let Override {
        username_override,
        device_name_override,
        sys_distro_override,
        sys_shell_override,
    } = config.overrides;

    let generate_blocks = |block_type: BlockType| -> String {
        let mut blocks = String::new();
        let x: u8 = if block_type == BlockType::Light {
            10
        } else {
            4
        };

        for i in 0..9 {
            let color: String = format!("\x1b[{}{}m", x, i);
            let padding: String = " ".repeat(color_block_padding.into());
            let end_seq: String = End.to_string();
            let block: String = color + &padding + &end_seq;
            blocks.push_str(&block);
        }

        blocks
    };

    let generate_message = || -> Vec<String> {
        let mut wrapped_text: Vec<String> = vec![];
        let word_wrap: usize = word_wrap.into();

        if let Some(mut text) = welcome_message {
            if text.len() > word_wrap {
                while !text.is_empty() {
                    let (chunk, rest) =
                        text.split_at_closest(cmp::min(word_wrap, text.len()) as u8);
                    wrapped_text.push(chunk.to_string());
                    text = rest.to_string();
                }
            } else {
                wrapped_text = Vec::from([text]);
            }
        }

        wrapped_text
    };

    let generate_details = || -> HashMap<DetailKey, String> {
        HashMap::from([
            (
                Username,
                username_override
                    .unwrap_or(whoami::username())
                    .colorize(username_color),
            ),
            (
                DeviceName,
                device_name_override
                    .unwrap_or(whoami::devicename())
                    .colorize(device_name_color),
            ),
            (
                SysDistro,
                sys_distro_override
                    .unwrap_or(whoami::distro())
                    .colorize(default_text_color.clone()),
            ),
            (
                SysShellVersion,
                sys_shell_override
                    .unwrap_or(
                        get_shell_version(
                            var("SHELL")
                                .unwrap()
                                .split("/")
                                .last()
                                .unwrap_or_else(|| "bash")
                                .to_string(),
                        )
                        .unwrap_or_else(|| "unknown".to_string()),
                    )
                    .colorize(default_text_color.clone()),
            ),
            (
                CurrentDateTime,
                Local::now()
                    .format(&current_date_time_format)
                    .to_string()
                    .colorize(default_text_color),
            ),
        ])
    };

    BaseDetails {
        normal_blocks: generate_blocks(BlockType::Normal),
        light_blocks: generate_blocks(BlockType::Light),
        message: generate_message(),
        details: generate_details(),
    }
}

fn print_base_details(config: Config, base_details: BaseDetails, cute_img: String) -> () {
    let Display {
        should_display_text,
        should_display_blocks,
        should_display_image,
    } = config.displays;

    let Alignment {
        hr_node_repeat,
        space_before,
        space_after,
        lines_before,
        lines_after,
        ..
    } = config.alignments;

    let BulletChar {
        hr_divider_node,
        default_bullet,
        sys_distro_bullet,
        sys_shell_bullet,
        current_date_time_bullet,
        ..
    } = config.chars;

    let TextColor {
        sys_distro_bullet_color,
        sys_shell_bullet_color,
        current_date_time_bullet_color,
        hr_color,
        ..
    } = config.colors;

    let BaseDetails {
        normal_blocks,
        light_blocks,
        details,
        message,
    } = base_details;

    let empty_line: String = String::from(" ");
    let mut detail_list: Vec<String> = Vec::new();

    if should_display_blocks {
        detail_list.extend(vec![normal_blocks, light_blocks, empty_line.clone()]);
    }

    if should_display_text {
        let username: String = details.get(&Username).unwrap().into();
        let device_name: String = details.get(&DeviceName).unwrap().into();

        let mut hr_line: String = String::from("");

        if let Some(_) = hr_divider_node {
            hr_line = hr_divider_node
                .unwrap()
                .to_char()
                .to_string()
                .repeat(hr_node_repeat.into())
                .colorize(hr_color);
        }

        let sys_distro: String = details.get(&SysDistro).unwrap().into();
        let sys_shell_version: String = details.get(&SysShellVersion).unwrap().into();
        let current_date_time: String = details.get(&CurrentDateTime).unwrap().into();

        detail_list.extend(vec![
            format!("{} / {}", username, device_name),
            hr_line,
            format!(
                "{}  {}",
                sys_distro_bullet
                    .unwrap_or(default_bullet)
                    .to_char()
                    .to_string()
                    .colorize(sys_distro_bullet_color),
                sys_distro
            ),
            format!(
                "{}  {}",
                sys_shell_bullet
                    .unwrap_or(default_bullet)
                    .to_char()
                    .to_string()
                    .colorize(sys_shell_bullet_color),
                sys_shell_version
            ),
            format!(
                "{}  {}",
                current_date_time_bullet
                    .unwrap_or(default_bullet)
                    .to_char()
                    .to_string()
                    .colorize(current_date_time_bullet_color),
                current_date_time
            ),
            empty_line,
        ]);

        detail_list = detail_list.into_iter().filter(|s| !s.is_empty()).collect();

        detail_list.extend(message);
    }

    let regex: Regex = Regex::new(r"\x1b\[.*?\x1b\[0m").unwrap();

    let cute_img_height: usize = cute_img.lines().count();
    let cute_img_width: usize = regex.find_iter(cute_img.lines().next().unwrap()).count();
    let detail_list_height: usize = detail_list.len();
    let max_height: usize = cmp::max(detail_list_height, cute_img_height);

    let img_padding: String = " ".repeat(cute_img_width);
    let space_before_padding: String = " ".repeat(space_before);
    let space_after_padding: String = " ".repeat(space_after);
    let lines_before_padding: String = "\n".repeat(lines_before);
    let lines_after_padding: String = "\n".repeat(lines_after);

    print!("{}", lines_before_padding);

    if should_display_image {
        for i in 0..max_height {
            let img_line: &str = cute_img.lines().nth(i).unwrap_or(img_padding.as_str());
            let mut detail_line: String = String::from("");

            if let Some(_) = detail_list.get(i) {
                detail_line = detail_list[i].clone();
            }

            println!(
                "{}{}{}{}",
                space_before_padding, img_line, space_after_padding, detail_line
            );
        }
    } else {
        for line in detail_list {
            println!("{}{}", space_before_padding, line);
        }
    }

    print!("{}", lines_after_padding);
}
