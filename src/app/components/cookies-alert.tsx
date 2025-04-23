'use client';
/**
 * Importações utilizadas para gerenciamento de estado e interface do usuário:
 * 
 * - `useState`, `useEffect` (react):
 *    Hooks do React para gerenciamento de estado local e efeitos colaterais.
 * 
 * - `FaCookieBite` (react-icons/fa):
 *    Componente de ícone para representar cookies.
 * 
 * - `CookieConsent` interface representando os dados de consentimento de u so de cookies
 */

import { useState, useEffect } from 'react';
import { FaCookieBite } from 'react-icons/fa';
import { CookieConsent } from '../../../types/cookies';



const CookiesAlert = () => {

  /**
   * Estados do componente de alerta de cookies:
   * 
   * @param {boolean} showAlert - Estado para controlar a visibilidade do alerta de cookies
   * @param {string} ip - Estado para armazenar o endereço IP do usuário
   * @param {boolean | null} consent - Estado para armazenar o status de consentimento do usuário
   * 
   * @example
   * // Exemplo de uso dos estados
   * setShowAlert(true);
   * setIp("192.168.1.1");
   * setConsent(true);
   */
  const [showAlert, setShowAlert] = useState(false);
  const [ip, setIp] = useState<string>("");
  const [consent, setConsent] = useState<boolean | null>(null);

  /**
   * Função assíncrona que sincroniza o consentimento de cookies entre o armazenamento local e o banco de dados.
   * 
   * Esta função:
   * 1. Obtém o IP real do cliente através da API ipify
   * 2. Verifica o consentimento no banco de dados
   * 3. Sincroniza o consentimento entre o armazenamento local e o banco de dados
   * 4. Gerencia diferentes cenários de inconsistência entre as fontes de dados
   * 
   * @async
   * @function handleConsentSync
   * @throws {Error} Lança um erro se houver falha na comunicação com a API
   * @example
   * // Exemplo de uso
   * await handleConsentSync();
   * 
   * @returns {Promise<void>} Uma Promise que resolve quando a sincronização é concluída
   */

  const handleConsentSync = async () => {
    try {
      // Obtém o IP real do cliente
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip: realIp } = await ipResponse.json();
      setIp(realIp);

      // Verifica consentimento no banco
      const response = await fetch('/api/cookies-consent', {
        headers: {
          'x-forwarded-for': realIp
        }
      });
      const data = await response.json();

      const localConsent = localStorage.getItem('cookieConsent');

      // Se tiver consentimento local mas não no banco
      if (response.status === 404 && localConsent) {
        await fetch('/api/cookies-consent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': realIp
          },
          body: JSON.stringify({
            accepted: localConsent === 'true',
            timestamp: new Date(),
          }),
        });
      }

      // Se não tiver consentimento local mas tiver no banco
      if (response.ok && !localConsent) {
        await fetch('/api/cookies-consent', {
          method: 'DELETE',
          headers: {
            'x-forwarded-for': realIp
          }
        });
        setConsent(null);
        setShowAlert(true);
      }

      // Se tiver em ambos mas estiverem diferentes
      if (response.ok && localConsent && 
         data.permissão.toString() !== localConsent) {
        await fetch('/api/cookies-consent', {
          method: 'DELETE',
          headers: {
            'x-forwarded-for': realIp
          }
        });
        setShowAlert(true);
      }

    } catch (error) {
      console.error('Erro ao sincronizar consentimento:', error);
    }
  };

  /**
   * Estado que controla a exibição do alerta de cookies.
   * 
   * Este estado é utilizado para determinar se o alerta de consentimento de cookies
   * deve ser exibido ao usuário. O valor é inicialmente definido como `false` e
   * pode ser alterado com base nas preferências salvas do usuário ou na sincronização
   * com o servidor.
   * 
   * @type {boolean}
   * @default false
   * 
   * @example
   * // Exemplo de uso
   * setShowAlert(true); // Exibe o alerta
   * setShowAlert(false); // Oculta o alerta
   */
 
  useEffect(() => {
    handleConsentSync();
  }, []);




  /**
   * Efeito que verifica e sincroniza as preferências de cookies do usuário.
   * 
   * Este useEffect é executado uma única vez quando o componente é montado.
   * Ele verifica se existe uma preferência de cookies salva no localStorage
   * e atualiza o estado do componente de acordo:
   * 
   * - Se não houver preferência salva (`savedConsent === null`), exibe o alerta
   *   de cookies para o usuário (`setShowAlert(true)`).
   * - Se existir uma preferência salva, atualiza o estado de consentimento
   *   com o valor armazenado (`setConsent(savedConsent === 'true')`).
   * 
   * @example
   * // Exemplo de comportamento
   * // Se localStorage estiver vazio:
   * // - showAlert = true
   * // - consent = null
   * 
   * // Se localStorage tiver 'true':
   * // - showAlert = false
   * // - consent = true
   * 
   * // Se localStorage tiver 'false':
   * // - showAlert = false
   * // - consent = false
   */


  useEffect(() => {
    // Verifica se já existe uma preferência salva
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent === null) {
      setShowAlert(true);
    } else {
      setConsent(savedConsent === 'true');
    }
  }, []);


  /**
   * Manipula a aceitação do consentimento de cookies pelo usuário.
   * 
   * Esta função é chamada quando o usuário aceita o uso de cookies e:
   * 1. Atualiza o estado local de consentimento para `true`
   * 2. Salva a preferência no localStorage
   * 3. Oculta o alerta de cookies
   * 4. Envia uma requisição POST para o servidor registrando o consentimento
   * 
   * @async
   * @function handleAccept
   * @throws {Error} Se houver falha na comunicação com o servidor
   * @example
   * // Exemplo de uso
   * <button onClick={handleAccept}>Aceitar Cookies</button>
   * 
   * // Após execução:
   * // - consent = true
   * // - localStorage['cookieConsent'] = 'true'
   * // - showAlert = false
   * // - Requisição POST enviada para /api/cookies-consent
   */

  const handleAccept = async () => {
    setConsent(true);
    localStorage.setItem('cookieConsent', 'true');
    setShowAlert(false);

    try {
      const response = await fetch('/api/cookies-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accepted: true,
          timestamp: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar consentimento');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };




  /**
   * Manipula a recusa do consentimento de cookies pelo usuário.
   * 
   * Esta função é chamada quando o usuário recusa o uso de cookies e:
   * 1. Oculta o alerta de cookies sem salvar nenhuma preferência
   * 2. Não envia nenhuma requisição ao servidor
   * 
   * @function handleDecline
   * @example
   * // Exemplo de uso
   * <button onClick={handleDecline}>Recusar Cookies</button>
   * 
   * // Após execução:
   * // - showAlert = false
   * // - Nenhuma ação adicional é tomada
   */

  const handleDecline = () => {
    setShowAlert(false);
  };

 

  /**
   * Renderiza o componente de alerta de cookies.
   * 
   * O componente exibe um banner fixo na parte inferior da tela com:
   * - Ícone de cookie
   * - Mensagem explicativa sobre o uso de cookies
   * - Botões para aceitar ou recusar o uso de cookies
   * 
   * O banner só é exibido se o usuário ainda não tiver dado seu consentimento
   * (showAlert = true).
   * 
   * @returns {JSX.Element | null} O componente de alerta de cookies ou null se não for necessário exibir
   */

  if (!showAlert) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white p-4 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FaCookieBite className="text-2xl" />
          <div>
            <p className="font-semibold">Uso de Cookies</p>
            <p className="text-sm">
              Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de cookies.
              //criar a pagina de politica de cookies
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
          >
            Recusar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiesAlert;
