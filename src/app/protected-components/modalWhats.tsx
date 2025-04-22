  

  //função para envio do whatsapp
  const enviarLinkWhatsApp = (idReuniao: string, numeroPaciente: string) => {
    const linkReuniao = `/publiccall/${idReuniao}`;
    const mensagem = `Olá! Aqui está o link para acessar sua reunião: ${window.location.origin}${linkReuniao}`;
    
    // Construindo o link para o WhatsApp
    const url = `https://wa.me/${numeroPaciente}?text=${encodeURIComponent(mensagem)}`;
    
    // Abrindo o link no WhatsApp Web
    window.open(url, '_blank');
  };