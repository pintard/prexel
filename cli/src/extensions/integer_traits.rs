pub trait IntegerHandling {
    fn to_char(&self) -> char;
}

impl IntegerHandling for u32 {
    fn to_char(&self) -> char {
        std::char::from_u32(*self).expect("Invalid unicode value")
    }
}
