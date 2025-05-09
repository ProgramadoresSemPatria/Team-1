def unique_constraint_message(error: Exception) -> str:
    """Gera uma mensagem de erro para violações de restrição de unicidade.

    Args:
        error (Exception): A exceção que contém a mensagem de erro.

    Returns:
        str: Mensagem indicando que o valor já está registrado.
    """
    string_error = str(error)
    
    # Encontrar posições dos delimitadores
    dots_position = string_error.find(":")
    break_line_position = string_error.find("\n")
    dot_between_position = string_error.find(".", dots_position)

    # Verificar se as posições são válidas
    if dot_between_position == -1 or break_line_position == -1:
        return "An error occurred. Please try again."

    column_name = string_error[dot_between_position + 1:break_line_position].strip().capitalize()
    return f"{column_name} already registered. Choose another one."