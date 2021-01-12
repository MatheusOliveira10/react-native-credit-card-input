export const removeNonNumber = (string = "") => string.replace(/[^\d]/g, "");
export const removeLeadingSpaces = (string = "") => string.replace(/^\s+/g, "");

export function formataCPFCNPJ(doc) {
    let result = ''

    if (doc != undefined) {
        let pessoaFisica = doc.length == 11;

        if (pessoaFisica === true) {
            result = doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        } else {
            result = doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5')
        }

        return result
    } else {
        return false
    }
}

//funções para verificação de documentos
export function verificaCPFCNPJ(valor) {
    if (valor != undefined) {
        // Garante que o valor é uma string
        valor = valor.toString();

        // Remove caracteres inválidos do valor
        valor = valor.replace(/[^0-9]/g, '');

        // Verifica CPF
        if (valor.length === 11) {
            return 'CPF';
        }

        // Verifica CNPJ
        else if (valor.length === 14) {
            return 'CNPJ';
        }

        // Não retorna nada
        else {
            return false;
        }
    } else {
        return false;
    }
} // verificaCPFCNPJ

/*
 calcDigitosPosicoes
 
 Multiplica dígitos vezes posições
 
 @param string digitos Os digitos desejados
 @param string posicoes A posição que vai iniciar a regressão
 @param string soma_digitos A soma das multiplicações entre posições e dígitos
 @return string Os dígitos enviados concatenados com o último dígito
*/
export function calcDigitosPosicoes(digitos, posicoes = 10, soma_digitos = 0) {

    // Garante que o valor é uma string
    digitos = digitos.toString();

    // Faz a soma dos dígitos com a posição
    // Ex. para 10 posições:
    //   0    2    5    4    6    2    8    8   4
    // x10   x9   x8   x7   x6   x5   x4   x3  x2
    //   0 + 18 + 40 + 28 + 36 + 10 + 32 + 24 + 8 = 196
    for (var i = 0; i < digitos.length; i++) {
        // Preenche a soma com o dígito vezes a posição
        soma_digitos = soma_digitos + (digitos[i] * posicoes);

        // Subtrai 1 da posição
        posicoes--;

        // Parte específica para CNPJ
        // Ex.: 5-4-3-2-9-8-7-6-5-4-3-2
        if (posicoes < 2) {
            // Retorno a posição para 9
            posicoes = 9;
        }
    }

    // Captura o resto da divisão entre soma_digitos dividido por 11
    // Ex.: 196 % 11 = 9
    soma_digitos = soma_digitos % 11;

    // Verifica se soma_digitos é menor que 2
    if (soma_digitos < 2) {
        // soma_digitos agora será zero
        soma_digitos = 0;
    } else {
        // Se for maior que 2, o resultado é 11 menos soma_digitos
        // Ex.: 11 - 9 = 2
        // Nosso dígito procurado é 2
        soma_digitos = 11 - soma_digitos;
    }

    // Concatena mais um dígito aos primeiro nove dígitos
    // Ex.: 025462884 + 2 = 0254628842
    var cpf = digitos + soma_digitos;

    // Retorna
    return cpf;

} // calcDigitosPosicoes

/*
 Valida CPF
 
 Valida se for CPF
 
 @param  string cpf O CPF com ou sem pontos e traço
 @return bool True para CPF correto - False para CPF incorreto
*/
export function validaCPF(valor) {

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // Captura os 9 primeiros dígitos do CPF
    // Ex.: 02546288423 = 025462884
    var digitos = valor.substr(0, 9);

    // Faz o cálculo dos 9 primeiros dígitos do CPF para obter o primeiro dígito
    var novoCPF = calcDigitosPosicoes(digitos);

    // Faz o cálculo dos 10 dígitos do CPF para obter o último dígito
    var novoCPF = calcDigitosPosicoes(novoCPF, 11);

    // Verifica se o novo CPF gerado é idêntico ao CPF enviado
    if (novoCPF === valor) {
        // CPF válido
        return true;
    } else {
        // CPF inválido
        return false;
    }

} // validaCPF

/*
 validaCNPJ
 
 Valida se for um CNPJ
 
 @param string cnpj
 @return bool true para CNPJ correto
*/
export function validaCNPJ(valor) {

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');


    // O valor original
    var cnpj_original = valor;

    // Captura os primeiros 12 números do CNPJ
    var primeiros_numerosCNPJ = valor.substr(0, 12);

    // Faz o primeiro cálculo
    var primeiro_calculo = calcDigitosPosicoes(primeiros_numerosCNPJ, 5);

    // O segundo cálculo é a mesma coisa do primeiro, porém, começa na posição 6
    var segundo_calculo = calcDigitosPosicoes(primeiro_calculo, 6);

    // Concatena o segundo dígito ao CNPJ
    var cnpj = segundo_calculo;

    // Verifica se o CNPJ gerado é idêntico ao enviado
    if (cnpj === cnpj_original) {
        return true;
    }

    // Retorna falso por padrão
    return false;

} // validaCNPJ

/*
 validaCPFCNPJ
 
 Valida o CPF ou CNPJ
 
 @access public
 @return bool true para válido, false para inválido
*/
export function validaCPFCNPJ(valor) {
    if (valor != undefined) {
        // Verifica se é CPF ou CNPJ
        var valida = verificaCPFCNPJ(valor);

        // Garante que o valor é uma string
        valor = valor.toString();

        // Remove caracteres inválidos do valor
        valor = valor.replace(/[^0-9]/g, '');

        // Valida CPF
        if (valida === 'CPF') {
            // Retorna true para cpf válido
            return validaCPF(valor);
        }

        // Valida CNPJ
        else if (valida === 'CNPJ') {
            // Retorna true para CNPJ válido
            return validaCNPJ(valor);
        }

        // Não retorna nada
        else {
            return false;
        }
    } else {
        return false;
    }
} // validaCPFCNPJ