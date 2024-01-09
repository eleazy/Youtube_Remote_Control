Controle remoto para Youtube, desenvolvido para uso pessoal.

O funcionamento ocorre da seguinte forma, uma extenção do Chrome está ativa no youtube, a mesma realiza leituras no banco de dados em busca de
instruções para realizar na página. Também possui a função de coletar videos e inserir no bando de dados.

Um website serve como controle, realiza a leitura dos videos no banco de dados e os dispõe na tela, um video quando selecionado é inserido no
banco de dados com a instrução "Play (url)", e então a extenção do Chrome realiza a instrução.
Existem no website os controles volume, play-Pause, pesquisar, trocar playlist e reiniciar. 

O website foi construido com html, css e javascript, para hosting foi utilizado vercel.

No bando de dados existem apenas duas tabelas, videosList com os videos e actionList com a instrução. A linha "action" é sempre reescrita.

Na api foram utilizados express e mysql, o hosting é local, feito através do ngrok.
</br></br></br>

![mainScreen](https://github.com/eleazy/Youtube_Remote_Control/assets/37671310/037ee365-5ec8-4209-aa47-08ab807b2d17)
![searchScreen](https://github.com/eleazy/Youtube_Remote_Control/assets/37671310/d83ee4da-276a-46b3-be2b-4f7cb1c0cec5)
![changePlaylist](https://github.com/eleazy/Youtube_Remote_Control/assets/37671310/7afa9d3a-0b93-4b4c-b15b-ee7cc8f33b1f)
![volumeSlider](https://github.com/eleazy/Youtube_Remote_Control/assets/37671310/5aa8f193-b1ef-4af5-a5fa-6b3950d343c9)
