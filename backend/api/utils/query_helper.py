#Esse arquivo foi criado com o auxílio de IA
from api.utils.operators import convert_text_to_operator

def build_where_clause(**filters):
    where_clause_parts = []

    for column, value in filters.items():
        if isinstance(value, dict):
            operator = value.get("operator")
            val = value.get("value")
            if operator and val:
                where_clause_parts.append(f"{column} {convert_text_to_operator(operator)} '{val}'")
        else:
            list_formatted = [f"'{i}'" for i in value ]
            where_clause_parts.append(f"{column} IN ({','.join(list_formatted)})")

    where_clause = "WHERE " + " AND ".join(where_clause_parts) if where_clause_parts else ""

    return where_clause