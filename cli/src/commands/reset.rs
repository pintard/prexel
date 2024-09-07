use std::{env::current_dir, fs, io::stdin};

use crate::{
    constants::{
        config::{Alignment, BulletChar, Config, Details, Display, Formats, Override, TextColor},
        esc_seq::EscSeq,
    },
    extensions::string_traits::TextHandling,
};

pub fn reset_command() {
    let config_path: String = current_dir()
        .unwrap()
        .join("src/configs/.config.yaml")
        .to_str()
        .unwrap()
        .to_string();

    if prompt_confirmation(
        "Are you sure you want to reset your configuration? All settings will be permanently lost (y/N):"
            .to_string()
            .colorize(EscSeq::Yellow),
    ) {
        reset_configuration(config_path);
    } else {
        let err_message: String =
            String::from("Configuration operation cancelled.\n").colorize(EscSeq::Red);
        println!("{err_message}");
    }
}

fn prompt_confirmation(prompt: String) -> bool {
    loop {
        println!("{}", prompt);
        let mut input = String::new();
        stdin().read_line(&mut input).expect("Failed to read line");

        match input.trim().to_lowercase().as_str() {
            "Y" | "y" => return true,
            "N" | "n" => return false,
            _ => {
                let err_message: String =
                    String::from("Invalid choice. Please enter (y/N).\n").colorize(EscSeq::Red);
                println!("{err_message}");
            }
        }
    }
}

fn reset_configuration(file_path: String) -> () {
    let default_formats: Formats = Formats {
        current_date_time_format: String::from("%b %d, %Y"),
    };

    let default_displays: Display = Display {
        should_display_image: true,
        should_display_blocks: true,
        should_display_text: true,
    };

    let default_alignments: Alignment = Alignment {
        space_before: 2,
        space_after: 2,
        lines_before: 2,
        lines_after: 2,
        hr_node_repeat: 18,
        word_wrap: 30,
        color_block_padding: 4,
    };

    let default_chars: BulletChar = BulletChar {
        hr_divider_node: Some(0x2219),
        default_bullet: 0x2219,
        sys_distro_bullet: Some(0xfb32),
        sys_shell_bullet: Some(0xf489),
        current_date_time_bullet: Some(0xf073),
    };

    let default_colors: TextColor = TextColor {
        default_text_color: EscSeq::Black,
        username_color: EscSeq::Green,
        device_name_color: EscSeq::Yellow,
        welcome_message_color: EscSeq::LightGreen,
        hr_color: EscSeq::LightBlue,
        default_bullet_color: EscSeq::LightBlue,
        sys_distro_bullet_color: EscSeq::LightRed,
        sys_shell_bullet_color: EscSeq::LightMagenta,
        current_date_time_bullet_color: EscSeq::LightCyan,
    };

    let default_overrides: Override = Override {
        username_override: None,
        device_name_override: None,
        sys_distro_override: None,
        sys_shell_override: None,
    };

    let default_details: Details = Details {
        welcome_message: None,
    };

    let default_config: Config = Config {
        formats: default_formats,
        displays: default_displays,
        alignments: default_alignments,
        chars: default_chars,
        colors: default_colors,
        overrides: default_overrides,
        details: default_details,
    };

    let serialized_config: String =
        serde_yaml::to_string(&default_config).expect("Failed to serialize to YAML");
    fs::write(file_path, serialized_config).unwrap();

    let success_message: String =
        String::from("Configuration reset to default settings.\n").colorize(EscSeq::Green);
    println!("{success_message}");
}
