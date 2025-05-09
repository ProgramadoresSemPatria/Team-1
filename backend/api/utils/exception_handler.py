from fastapi import HTTPException, status
from api.utils.response_helper import unique_constraint_message
import logging

# Configuração do logger
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

def handle_exception(e: Exception) -> None:
    """Centraliza o tratamento de exceções para operações de banco de dados.

    Mapeia violações de restrição de unicidade para HTTP 400, outras para HTTP 500.
    
    Args:
        e (Exception): A exceção a ser tratada.
    
    Raises:
        HTTPException: Exceção HTTP com o status apropriado e detalhes.
    """
    error_str = str(e)
    logger.error(f"Erro ocorrido: {error_str}")  # Logando o erro

    for error in ["unique constraint failed", "restrição de unicidade"]:
        if error in error_str.lower():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=unique_constraint_message(e))

    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Um erro inesperado ocorreu.")
