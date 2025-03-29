def convert_text_to_operator(text:str):
    match text :
        case "gte": return ">="
        case "gt": return ">"
        case "e": return "="
        case "lt": return "<"
        case "lte": return "<="
