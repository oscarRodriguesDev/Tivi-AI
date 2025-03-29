// Classe de erro personalizada para CPF inválido
class InvalidCPFError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidCPFError';
    }
}

export function validarCPF(cpf: string): string {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');

    // Verifica se o CPF tem 11 dígitos ou se é uma sequência inválida
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        
        throw new InvalidCPFError('O CPF deve ter 11 dígitos e não pode ser uma sequência repetida.');
   
    }

    // Função auxiliar para calcular os dígitos verificadores
    const calcularDigito = (limit: number) => {
        let total = 0;
        for (let i = 0; i < limit; i++) {
            total += parseInt(cpf[i]) * (limit + 1 - i);
        }
        const resto = total % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    // Valida os dois dígitos verificadores
    const digito1 = calcularDigito(9);
    const digito2 = calcularDigito(10);

    if (digito1 !== parseInt(cpf[9]) || digito2 !== parseInt(cpf[10])) {
        throw new InvalidCPFError('O CPF digitado não é válido.');
    }

    // CPF válido, retorna o CPF sem pontos e traços
    return cpf;
}

// Exemplo de uso:
try {
    const cpfLimpo = validarCPF('123.456.789-09');
    console.log('CPF válido:', cpfLimpo);
} catch (error) {
    if (error instanceof InvalidCPFError) {
        console.error('Erro de validação:', error.message);
    } else {
        console.error('Erro inesperado:', error);
    }
}
