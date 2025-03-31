def unique_constraint_message(erro):
    string_error = str(erro)
    dots_position = string_error.find(":")
    break_line_position = string_error.find("\n")
    dot_between_position = string_error.find(".", dots_position)
    column_name = string_error[dot_between_position + 1:break_line_position].capitalize()
    return f"{column_name} already registered. Choose another one"