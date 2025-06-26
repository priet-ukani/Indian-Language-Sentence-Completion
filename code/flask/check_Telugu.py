def is_telugu_script(input_str):
    # Telugu script Unicode range
    telugu_range = (0x0C00, 0x0C7F)
    
    # Check if all characters in the input string are Telugu script characters
    for char in input_str:
        # Ignore punctuation and special characters
        if char.isalpha():
            if ord(char) < telugu_range[0] or ord(char) > telugu_range[1]:
                return False
    return True

# Example usage:
input_str = input("Enter a string: ")
if is_telugu_script(input_str):
    print("All characters in the input are Telugu script characters.")
else:
    print("Not all characters in the input are Telugu script characters.")
