def unique_constraint_message(error: Exception) -> str:
    """Generates an error message for unique constraint violations.

    Args:
        error (Exception): The exception that contains the error message.

    Returns:
        str: Message indicating that the value is already registered.
    """
    string_error = str(error)
    
    # Find delimiter positions
    dots_position = string_error.find(":")
    break_line_position = string_error.find("\n")
    dot_between_position = string_error.find(".", dots_position)

    # Check if positions are valid
    if dot_between_position == -1 or break_line_position == -1:
        return "An error occurred. Please try again."

    column_name = string_error[dot_between_position + 1:break_line_position].strip().capitalize()
    return f"{column_name} already registered. Choose another one."