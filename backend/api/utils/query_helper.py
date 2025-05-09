#Esse arquivo foi criado com o auxílio de IA
from api.utils.operators import convert_text_to_operator

def build_where_clause(**filters: dict) -> str:
    """Constrói uma cláusula WHERE a partir de filtros fornecidos.

    Args:
        filters (dict): Um dicionário onde as chaves são os nomes das colunas e os valores são os filtros.

    Returns:
        str: A cláusula WHERE gerada.
    """
    where_clause_parts = []

    for column, value in filters.items():
        if isinstance(value, dict):
            operator = value.get("operator")
            filter_value = value.get("value")
            if operator and filter_value:
                where_clause_parts.append(f"{column} {convert_text_to_operator(operator)} '{filter_value}'")
        else:
            list_formatted = [f"'{i}'" for i in value]
            where_clause_parts.append(f"{column} IN ({','.join(list_formatted)})")

    where_clause = "WHERE " + " AND ".join(where_clause_parts) if where_clause_parts else ""

    return where_clause