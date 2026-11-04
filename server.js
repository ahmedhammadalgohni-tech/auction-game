const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const fs = require('fs');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    const inPublic = path.join(__dirname, 'public', 'index.html');
    res.sendFile(fs.existsSync(inPublic) ? inPublic : path.join(__dirname, 'index.html'));
});

const rooms = {};

const allPlayersPool = [
 { n: "M. Locatelli", r: 84 },
    { n: "N. Pépé", r: 80 },
    { n: "L. Hrádecký", r: 81 },
    { n: "N. Pope", r: 81 },
    { n: "Maradona", r: 97 },
    { n: "O. Baumann", r: 83 },
    { n: "H. Vanaken", r: 80 },
    { n: "Yeremy Pino", r: 80 },
    { n: "M. Ginter", r: 82 },
    { n: "F. Dimarco", r: 85 },
    { n: "M. Sels", r: 83 },
    { n: "J. Schouten", r: 80 },
    { n: "M. Guendouzi", r: 82 },
    { n: "R. Andrich", r: 81 },
    { n: "P. Zieliński", r: 80 },
    { n: "Marc Cucurella", r: 84 },
    { n: "F. Wirtz", r: 89 },
    { n: "P. Gulácsi", r: 85 },
    { n: "M. Rashford", r: 80 },
    { n: "Zidane", r: 96 },
    { n: "A. Bastoni", r: 87 },
    { n: "K. Coman", r: 83 },
    { n: "D. Vlahović", r: 83 },
    { n: "T. Hernandez", r: 87 },
    { n: "J. Musiala", r: 88 },
    { n: "M. Maignan", r: 87 },
    { n: "R. Leão", r: 86 },
    { n: "H. Kane", r: 90 },
    { n: "J. Bellingham", r: 90 },
    { n: "K. De Bruyne", r: 90 },
    { n: "V. Júnior", r: 90 },
    { n: "Rodri", r: 91 },
    { n: "K. Mbappé", r: 91 },
    { n: "E. Haaland", r: 91 },
    { n: "Ronaldo", r: 96 },
    { n: "Pelé", r: 98 },
    { n: "Ronaldinho", r: 95 },
    { n: "Maldini", r: 94 },
    { n: "Buffon", r: 93 },
    { n: "Henry", r: 94 },
    { n: "Xavi", r: 92 },
    { n: "Iniesta", r: 93 },
    { n: "Cafu", r: 92 },
    { n: "Roberto Carlos", r: 93 },
    { n: "Puyol", r: 91 },
    { n: "Nesta", r: 92 },
    { n: "Cannavaro", r: 93 },
    { n: "Pirlo", r: 92 },
    { n: "Kaká", r: 94 },
    { n: "Seedorf", r: 90 },
    { n: "Eto'o", r: 91 },
    { n: "Drogba", r: 90 },
    { n: "Van Basten", r: 95 },
    { n: "Gullit", r: 94 },
    { n: "Baggio", r: 93 },
    { n: "Platini", r: 94 },
    { n: "Matthäus", r: 92 },
    { n: "Schweinsteiger", r: 89 },
    { n: "Lahm", r: 91 },
    { n: "Neuer", r: 92 },
    { n: "Kahn", r: 93 },
    { n: "Schmeichel", r: 92 },
    { n: "Van der Sar", r: 90 },
    { n: "Cech", r: 91 },
    { n: "Ashley Cole", r: 89 },
    { n: "Terry", r: 91 },
    { n: "Ferdinand", r: 90 },
    { n: "Vidic", r: 89 },
    { n: "Gerrard", r: 92 },
    { n: "Lampard", r: 92 },
    { n: "Scholes", r: 91 },
    { n: "Rooney", r: 92 },
    { n: "Giggs", r: 90 },
    { n: "Beckham", r: 90 },
    { n: "Aguero", r: 91 },
    { n: "Yaya Toure", r: 89 },
    { n: "Kompany", r: 89 },
    { n: "Silva", r: 91 },
    { n: "Modric", r: 92 },
    { n: "Kroos", r: 91 },
    { n: "Casemiro", r: 89 },
    { n: "Marcelo", r: 89 },
    { n: "Ramos", r: 93 },
    { n: "Pepe", r: 88 },
    { n: "Benzema", r: 91 },
    { n: "Bale", r: 90 },
    { n: "Suarez", r: 92 },
    { n: "Neymar", r: 91 },
    { n: "Lewandowski", r: 92 },
    { n: "Muller", r: 90 },
    { n: "Ribery", r: 90 },
    { n: "Robben", r: 90 },
    { n: "Ibrahimovic", r: 92 },
    { n: "Buffon", r: 93 },
    { n: "Chiellini", r: 89 },
    { n: "Bonucci", r: 88 },
    { n: "Barzagli", r: 88 },
    { n: "Marchisio", r: 87 },
    { n: "Vidal", r: 88 },
    { n: "Pogba", r: 88 },
    { n: "Dybala", r: 87 },
    { n: "Higuain", r: 89 },
    { n: "Totti", r: 93 },
    { n: "De Rossi", r: 89 },
    { n: "Del Piero", r: 93 },
    { n: "Inzaghi", r: 90 },
    { n: "Shevchenko", r: 93 },
    { n: "Kaka", r: 94 },
    { n: "Rui Costa", r: 90 },
    { n: "Cafu", r: 92 },
    { n: "Stam", r: 90 },
    { n: "Nesta", r: 92 },
    { n: "Maldini", r: 94 },
    { n: "Gattuso", r: 89 },
    { n: "Ambrosini", r: 87 },
    { n: "Seedorf", r: 90 },
    { n: "Pirlo", r: 92 },
    { n: "Crespo", r: 90 },
    { n: "Adriano", r: 90 },
    { n: "Zanetti", r: 92 },
    { n: "Cambiasso", r: 89 },
    { n: "Milito", r: 88 },
    { n: "Eto'o", r: 91 },
    { n: "Sneijder", r: 90 },
    { n: "Maicon", r: 89 },
    { n: "Lucio", r: 89 },
    { n: "Samuel", r: 88 },
    { n: "Julio Cesar", r: 89 },
    { n: "Toldo", r: 88 },
    { n: "Ronaldo Nazario", r: 96 },
    { n: "Romario", r: 95 },
    { n: "Zico", r: 95 },
    { n: "Socrates", r: 92 },
    { n: "Falcao", r: 90 },
    { n: "Dunga", r: 88 },
    { n: "Taffarel", r: 89 },
    { n: "Bebeto", r: 90 },
    { n: "Rivaldo", r: 94 },
    { n: "Raul", r: 92 },
    { n: "Casillas", r: 93 },
    { n: "Hierro", r: 90 },
    { n: "Sanchis", r: 88 },
    { n: "Gento", r: 92 },
    { n: "Di Stefano", r: 97 },
    { n: "Puskas", r: 96 },
    { n: "Butragueno", r: 91 },
    { n: "Hugo Sanchez", r: 92 },
    { n: "Redondo", r: 90 },
    { n: "Guti", r: 87 },
    { n: "Morientes", r: 88 },
    { n: "Makélélé", r: 90 },
    { n: "Salgado", r: 88 },
    { n: "Carvalho", r: 89 },
    { n: "Khedira", r: 87 },
    { n: "Ozil", r: 89 },
    { n: "Di Maria", r: 89 },
    { n: "Valverde", r: 88 },
    { n: "Camavinga", r: 85 },
    { n: "Tchouameni", r: 85 },
    { n: "Rudiger", r: 88 },
    { n: "Alaba", r: 86 },
    { n: "Carvajal", r: 86 },
    { n: "Courtois", r: 90 },
    { n: "Militao", r: 86 },
    { n: "Rodrygo", r: 86 },
    { n: "Endrick", r: 80 },
    { n: "Arda Guler", r: 81 },
    { n: "Brahim Diaz", r: 83 },
    { n: "Mendy", r: 84 },
    { n: "Nacho", r: 83 },
    { n: "Lucas Vazquez", r: 82 },
    { n: "Kepa", r: 81 },
    { n: "Lunin", r: 82 },
    { n: "Pique", r: 89 },
    { n: "Dani Alves", r: 90 },
    { n: "Jordi Alba", r: 87 },
    { n: "Busquets", r: 89 },
    { n: "Mascherano", r: 88 },
    { n: "Rakitic", r: 87 },
    { n: "Arthur", r: 82 },
    { n: "De Jong", r: 87 },
    { n: "Pedri", r: 86 },
    { n: "Gavi", r: 84 },
    { n: "Araujo", r: 86 },
    { n: "Christensen", r: 84 },
    { n: "Kounde", r: 85 },
    { n: "Cancelo", r: 85 },
    { n: "Balde", r: 82 },
    { n: "Yamal", r: 85 },
    { n: "Lewandowski", r: 92 },
    { n: "Raphinha", r: 84 },
    { n: "Ferran Torres", r: 82 },
    { n: "Felix", r: 83 },
    { n: "Ter Stegen", r: 89 },
    { n: "Valdes", r: 88 },
    { n: "Koeman", r: 91 },
    { n: "Cruyff", r: 96 },
    { n: "Stoichkov", r: 92 },
    { n: "Laudrup", r: 91 },
    { n: "Romario", r: 95 },
    { n: "Ronaldinho", r: 95 },
    { n: "Messi", r: 94 },
    { n: "Neymar", r: 91 },
    { n: "Suarez", r: 92 },
    { n: "Rooney", r: 92 },
    { n: "Ronaldo", r: 96 },
    { n: "Tevez", r: 89 },
    { n: "Mascherano", r: 88 },
    { n: "Zanetti", r: 92 },
    { n: "Batistuta", r: 92 },
    { n: "Crespo", r: 90 },
    { n: "Riquelme", r: 91 },
    { n: "Aimar", r: 87 },
    { n: "Passarella", r: 91 },
    { n: "Kempes", r: 92 },
    { n: "Di Maria", r: 89 },
    { n: "Dybala", r: 87 },
    { n: "Lautaro Martinez", r: 88 },
    { n: "Julian Alvarez", r: 85 },
    { n: "Enzo Fernandez", r: 84 },
    { n: "Mac Allister", r: 84 },
    { n: "De Paul", r: 84 },
    { n: "Romero", r: 85 },
    { n: "Martinez", r: 87 },
    { n: "Otamendi", r: 83 },
    { n: "Acuna", r: 83 },
    { n: "Molina", r: 82 },
    { n: "Paredes", r: 83 },
    { n: "Lo Celso", r: 82 },
    { n: "Gonzalez", r: 82 },
    { n: "Garnacho", r: 81 },
    { n: "Carboni", r: 78 },
    { n: "Pellegrini", r: 83 },
    { n: "Chiesa", r: 84 },
    { n: "Barella", r: 87 },
    { n: "Bastoni", r: 87 },
    { n: "Dimarco", r: 85 },
    { n: "Calhanoglu", r: 86 },
    { n: "Thuram", r: 85 },
    { n: "Pavard", r: 84 },
    { n: "Acerbi", r: 83 },
    { n: "Sommer", r: 85 },
    { n: "Mkhitaryan", r: 83 },
    { n: "Darmian", r: 81 },
    { n: "Frattesi", r: 82 },
    { n: "Carlos Augusto", r: 81 },
    { n: "Arnautovic", r: 81 },
    { n: "Sanchez", r: 80 },
    { n: "Audero", r: 79 },
    { n: "Bisseck", r: 78 },
    { n: "De Vrij", r: 83 },
    { n: "Dumfries", r: 83 },
    { n: "Cuadrado", r: 80 },
    { n: "Sensi", r: 78 },
    { n: "Klaassen", r: 78 },
    { n: "Giroud", r: 82 },
    { n: "Pulisic", r: 83 },
    { n: "Loftus-Cheek", r: 81 },
    { n: "Okafor", r: 79 },
    { n: "Chukwueze", r: 80 },
    { n: "Reijnders", r: 82 },
    { n: "Bennacer", r: 82 },
    { n: "Adli", r: 79 },
    { n: "Musah", r: 78 },
    { n: "Kalulu", r: 79 },
    { n: "Thiaw", r: 79 },
    { n: "Kjaer", r: 80 },
    { n: "Florenzi", r: 79 },
    { n: "Sportiello", r: 78 },
    { n: "Jovic", r: 79 },
    { n: "Vlahovic", r: 83 },
    { n: "Bremer", r: 85 },
    { n: "Danilo", r: 82 },
    { n: "Alex Sandro", r: 80 },
    { n: "Gatti", r: 79 },
    { n: "Rugani", r: 78 },
    { n: "De Sciglio", r: 77 },
    { n: "Cambiaso", r: 80 },
    { n: "McKennie", r: 80 },
    { n: "Rabiot", r: 84 },
    { n: "Miretti", r: 77 },
    { n: "Fagioli", r: 78 },
    { n: "Weah", r: 78 },
    { n: "Milik", r: 80 },
    { n: "Perin", r: 80 },
    { n: "Szczesny", r: 86 },
    { n: "Immobile", r: 82 },
    { n: "Luis Alberto", r: 84 },
    { n: "Zaccagni", r: 82 },
    { n: "Provedel", r: 83 },
    { n: "Romagnoli", r: 82 },
    { n: "Casale", r: 79 },
    { n: "Marusic", r: 78 },
    { n: "Lazzari", r: 78 },
    { n: "Guendouzi", r: 82 },
    { n: "Kamada", r: 79 },
    { n: "Vecino", r: 78 },
    { n: "Rovella", r: 78 },
    { n: "Isaksen", r: 78 },
    { n: "Castellanos", r: 79 },
    { n: "Pedro", r: 79 },
    { n: "Felipe Anderson", r: 81 },
    { n: "Osimhen", r: 88 },
    { n: "Kvaratskhelia", r: 86 },
    { n: "Di Lorenzo", r: 85 },
    { n: "Politano", r: 81 },
    { n: "Zielinski", r: 80 },
    { n: "Anguissa", r: 82 },
    { n: "Lobotka", r: 84 },
    { n: "Juan Jesus", r: 77 },
    { n: "Rrahmani", r: 81 },
    { n: "Olivera", r: 78 },
    { n: "Meret", r: 81 },
    { n: "Simeone", r: 79 },
    { n: "Raspadori", r: 80 },
    { n: "Ngonge", r: 78 },
    { n: "Cajuste", r: 77 },
    { n: "Lindstrom", r: 78 },
    { n: "Mazzocchi", r: 77 },
    { n: "Natan", r: 77 },
    { n: "Ostigard", r: 77 },
    { n: "Dybala", r: 87 },
    { n: "Lukaku", r: 85 },
    { n: "Paredes", r: 83 },
    { n: "Cristante", r: 81 },
    { n: "Pellegrini", r: 83 },
    { n: "Aouar", r: 79 },
    { n: "Renato Sanches", r: 78 },
    { n: "Spinazzola", r: 80 },
    { n: "Smalling", r: 81 },
    { n: "Mancini", r: 81 },
    { n: "Ndicka", r: 80 },
    { n: "Karsdorp", r: 78 },
    { n: "Celik", r: 77 },
    { n: "Rui Patricio", r: 80 },
    { n: "Svilar", r: 78 },
    { n: "El Shaarawy", r: 80 },
    { n: "Azmoun", r: 78 },
    { n: "Abraham", r: 82 },
    { n: "Haaland", r: 91 },
    { n: "De Bruyne", r: 90 },
    { n: "Rodri", r: 91 },
    { n: "Foden", r: 88 },
    { n: "Silva", r: 90 },
    { n: "Dias", r: 89 },
    { n: "Stones", r: 85 },
    { n: "Walker", r: 84 },
    { n: "Gvardiol", r: 83 },
    { n: "Ederson", r: 88 },
    { n: "Akanji", r: 82 },
    { n: "Ake", r: 82 },
    { n: "Kovacic", r: 82 },
    { n: "Grealish", r: 84 },
    { n: "Doku", r: 80 },
    { n: "Alvarez", r: 84 },
    { n: "Nunes", r: 81 },
    { n: "Lewis", r: 78 },
    { n: "Bobb", r: 76 },
    { n: "Ortega", r: 81 },
    { n: "Saka", r: 87 },
    { n: "Odegaard", r: 89 },
    { n: "Rice", r: 88 },
    { n: "Saliba", r: 87 },
    { n: "Gabriel", r: 86 },
    { n: "White", r: 84 },
    { n: "Zinchenko", r: 80 },
    { n: "Timber", r: 82 },
    { n: "Tomiyasu", r: 81 },
    { n: "Partey", r: 84 },
    { n: "Jorginho", r: 81 },
    { n: "Havertz", r: 84 },
    { n: "Trossard", r: 82 },
    { n: "Martinelli", r: 84 },
    { n: "Jesus", r: 83 },
    { n: "Nketiah", r: 78 },
    { n: "Raya", r: 83 },
    { n: "Ramsdale", r: 82 },
    { n: "Smith Rowe", r: 79 },
    { n: "Vieira", r: 78 },
    { n: "Kiwior", r: 78 },
    { n: "Salah", r: 89 },
    { n: "Van Dijk", r: 89 },
    { n: "Alisson", r: 89 },
    { n: "Robertson", r: 85 },
    { n: "Alexander-Arnold", r: 86 },
    { n: "Konate", r: 82 },
    { n: "Gomez", r: 79 },
    { n: "Matip", r: 80 },
    { n: "Quansah", r: 76 },
    { n: "Bradley", r: 76 },
    { n: "Tsimikas", r: 78 },
    { n: "Mac Allister", r: 84 },
    { n: "Szoboszlai", r: 82 },
    { n: "Endo", r: 80 },
    { n: "Gravenberch", r: 79 },
    { n: "Jones", r: 79 },
    { n: "Elliott", r: 79 },
    { n: "Diaz", r: 84 },
    { n: "Nunez", r: 82 },
    { n: "Jota", r: 85 },
    { n: "Gakpo", r: 83 },
    { n: "Kelleher", r: 78 },
    { n: "Son", r: 87 },
    { n: "Maddison", r: 84 },
    { n: "Vicario", r: 82 },
    { n: "Romero", r: 85 },
    { n: "Van de Ven", r: 81 },
    { n: "Porro", r: 82 },
    { n: "Udogie", r: 81 },
    { n: "Bissouma", r: 81 },
    { n: "Bentancur", r: 81 },
    { n: "Kulusevski", r: 82 },
    { n: "Richarlison", r: 80 },
    { n: "Johnson", r: 79 },
    { n: "Werner", r: 80 },
    { n: "Dragusin", r: 79 },
    { n: "Emerson", r: 78 },
    { n: "Davies", r: 78 },
    { n: "Lo Celso", r: 79 },
    { n: "Skipp", r: 76 },
    { n: "Hojbjerg", r: 80 },
    { n: "Forster", r: 77 },
    { n: "Palmer", r: 85 },
    { n: "Nkunku", r: 83 },
    { n: "Sterling", r: 81 },
    { n: "James", r: 84 },
    { n: "Chilwell", r: 80 },
    { n: "Silva", r: 84 },
    { n: "Colwill", r: 79 },
    { n: "Disasi", r: 79 },
    { n: "Badiashile", r: 79 },
    { n: "Fofana", r: 79 },
    { n: "Gusto", r: 79 },
    { n: "Caicedo", r: 82 },
    { n: "Fernandez", r: 83 },
    { n: "Gallagher", r: 81 },
    { n: "Lavia", r: 77 },
    { n: "Mudryk", r: 77 },
    { n: "Madueke", r: 77 },
    { n: "Jackson", r: 79 },
    { n: "Sanchez", r: 78 },
    { n: "Petrovic", r: 77 },
    { n: "Bruno Fernandes", r: 87 },
    { n: "Rashford", r: 80 },
    { n: "Casemiro", r: 89 },
    { n: "Mount", r: 79 },
    { n: "Antony", r: 77 },
    { n: "Hojlund", r: 81 },
    { n: "Garnacho", r: 81 },
    { n: "Mainoo", r: 79 },
    { n: "Martinez", r: 84 },
    { n: "Varane", r: 85 },
    { n: "Maguire", r: 79 },
    { n: "Lindelof", r: 78 },
    { n: "Shaw", r: 81 },
    { n: "Wan-Bissaka", r: 79 },
    { n: "Dalot", r: 80 },
    { n: "Onana", r: 82 },
    { n: "Bayindir", r: 76 },
    { n: "Eriksen", r: 79 },
    { n: "McTominay", r: 80 },
    { n: "Amrabat", r: 78 },
    { n: "Diallo", r: 76 },
    { n: "Mbappe", r: 91 },
    { n: "Dembélé", r: 85 },
    { n: "Hakimi", r: 84 },
    { n: "Marquinhos", r: 87 },
    { n: "Donnarumma", r: 87 },
    { n: "Hernandez", r: 85 },
    { n: "Skriniar", r: 84 },
    { n: "Ugarte", r: 81 },
    { n: "Ruiz", r: 81 },
    { n: "Vitinha", r: 83 },
    { n: "Lee Kang In", r: 79 },
    { n: "Ramos", r: 80 },
    { n: "Kolo Muani", r: 82 },
    { n: "Barcola", r: 78 },
    { n: "Zaire-Emery", r: 81 },
    { n: "Nuno Mendes", r: 82 },
    { n: "Danilo Pereira", r: 81 },
    { n: "Asensio", r: 81 },
    { n: "Soler", r: 78 },
    { n: "Navas", r: 81 },
    { n: "Kane", r: 90 },
    { n: "Musiala", r: 88 },
    { n: "Sane", r: 84 },
    { n: "Gnabry", r: 82 },
    { n: "Coman", r: 83 },
    { n: "Muller", r: 85 },
    { n: "Kimmich", r: 88 },
    { n: "Goretzka", r: 84 },
    { n: "Davies", r: 82 },
    { n: "Kim Min Jae", r: 84 },
    { n: "Upamecano", r: 82 },
    { n: "De Ligt", r: 85 },
    { n: "Neuer", r: 87 },
    { n: "Guerreiro", r: 81 },
    { n: "Laimer", r: 82 },
    { n: "Tel", r: 77 },
    { n: "Boey", r: 78 },
    { n: "Zaragoza", r: 78 },
    { n: "Peretz", r: 75 },
    { n: "Ulreich", r: 76 },
    { n: "Wirtz", r: 89 },
    { n: "Boniface", r: 82 },
    { n: "Frimpong", r: 84 },
    { n: "Grimaldo", r: 85 },
    { n: "Xhaka", r: 83 },
    { n: "Palacios", r: 82 },
    { n: "Tah", r: 82 },
    { n: "Hincapie", r: 81 },
    { n: "Kossounou", r: 81 },
    { n: "Schick", r: 81 },
    { n: "Hradecky", r: 81 },
    { n: "Adli", r: 79 },
    { n: "Tella", r: 78 },
    { n: "Iglesias", r: 78 },
    { n: "Kovar", r: 76 },
    { n: "Stanisic", r: 78 },
    { n: "Andrich", r: 81 },
    { n: "Guirassy", r: 82 },
    { n: "Undav", r: 80 },
    { n: "Fuhrich", r: 80 },
    { n: "Millot", r: 78 },
    { n: "Stiller", r: 79 },
    { n: "Anton", r: 81 },
    { n: "Ito", r: 80 },
    { n: "Mittelstadt", r: 79 },
    { n: "Nubel", r: 81 },
    { n: "Openda", r: 83 },
    { n: "Simons", r: 84 },
    { n: "Sesko", r: 81 },
    { n: "Olmo", r: 84 },
    { n: "Simakan", r: 80 },
    { n: "Lukeba", r: 80 },
    { n: "Raum", r: 81 },
    { n: "Henrichs", r: 79 },
    { n: "Schlager", r: 81 },
    { n: "Kampl", r: 78 },
    { n: "Gulacsi", r: 81 },
    { n: "Fullkrug", r: 81 },
    { n: "Brandt", r: 84 },
    { n: "Malen", r: 82 },
    { n: "Adeyemi", r: 80 },
    { n: "Sancho", r: 82 },
    { n: "Reus", r: 82 },
    { n: "Can", r: 81 },
    { n: "Sabitzer", r: 82 },
    { n: "Nmecha", r: 78 },
    { n: "Hummels", r: 83 },
    { n: "Schlotterbeck", r: 83 },
    { n: "Sule", r: 81 },
    { n: "Ryerson", r: 79 },
    { n: "Maatsen", r: 80 },
    { n: "Kobel", r: 86 },
    { n: "Griezmann", r: 88 },
    { n: "Morata", r: 83 },
    { n: "Depay", r: 81 },
    { n: "Correa", r: 80 },
    { n: "Koke", r: 84 },
    { n: "De Paul", r: 84 },
    { n: "Llorente", r: 83 },
    { n: "Barrios", r: 77 },
    { n: "Witsel", r: 81 },
    { n: "Hermoso", r: 82 },
    { n: "Gimenez", r: 83 },
    { n: "Azpilicueta", r: 79 },
    { n: "Molina", r: 82 },
    { n: "Lino", r: 81 },
    { n: "Oblak", r: 88 },
    { n: "Savic", r: 81 },
    { n: "Reinildo", r: 79 },
    { n: "Gabriel Paulista", r: 79 },
    { n: "Saul", r: 78 },
    { n: "Isco", r: 81 },
    { n: "Fekir", r: 82 },
    { n: "Carvalho", r: 80 },
    { n: "Guido Rodriguez", r: 82 },
    { n: "Ayoze Perez", r: 78 },
    { n: "Bellerin", r: 77 },
    { n: "Rui Silva", r: 80 },
    { n: "Bravo", r: 79 },
    { n: "Gerard Moreno", r: 83 },
    { n: "Parejo", r: 82 },
    { n: "Sorloth", r: 81 },
    { n: "Baena", r: 82 },
    { n: "Capoue", r: 79 },
    { n: "Coquelin", r: 77 },
    { n: "Albiol", r: 79 },
    { n: "Foyth", r: 80 },
    { n: "Pedraza", r: 78 },
    { n: "Jorgensen", r: 78 },
    { n: "Inaki Williams", r: 82 },
    { n: "Nico Williams", r: 84 },
    { n: "Sancet", r: 81 },
    { n: "Vesga", r: 78 },
    { n: "Herrera", r: 79 },
    { n: "Vivian", r: 79 },
    { n: "Yeray", r: 78 },
    { n: "Yuri", r: 78 },
    { n: "De Marcos", r: 78 },
    { n: "Unai Simon", r: 83 },
    { n: "Oyarzabal", r: 82 },
    { n: "Merino", r: 84 },
    { n: "Zubimendi", r: 84 },
    { n: "Kubo", r: 83 },
    { n: "Brais Mendez", r: 82 },
    { n: "Traore", r: 80 },
    { n: "Le Normand", r: 83 },
    { n: "Zubeldia", r: 80 },
    { n: "Tierney", r: 79 },
    { n: "Remiro", r: 82 },
    { n: "Savinho", r: 82 },
    { n: "Dovbyk", r: 83 },
    { n: "Tsygankov", r: 82 },
    { n: "Aleix Garcia", r: 82 },
    { n: "Yangel Herrera", r: 79 },
    { n: "Miguel Gutierrez", r: 80 },
    { n: "Blind", r: 79 },
    { n: "Eric Garcia", r: 78 },
    { n: "Yan Couto", r: 79 },
    { n: "Gazzaniga", r: 78 },
    { n: "Portu", r: 77 },
    { n: "Stuani", r: 78 },
    { n: "Valverde", r: 88 },
    { n: "Bellingham", r: 90 },
    { n: "Vinicius Jr", r: 90 },
    { n: "Rodrygo", r: 86 },
    { n: "Modric", r: 87 },
    { n: "Kroos", r: 88 },
    { n: "Camavinga", r: 85 },
    { n: "Tchouameni", r: 85 },
    { n: "Carvajal", r: 86 },
    { n: "Rudiger", r: 88 },
    { n: "Militao", r: 86 },
    { n: "Alaba", r: 85 },
    { n: "Mendy", r: 82 },
    { n: "Courtois", r: 90 },
    { n: "Lunin", r: 80 },
    { n: "Nacho", r: 81 },
    { n: "Lucas Vazquez", r: 80 },
    { n: "Brahim Diaz", r: 82 },
    { n: "Arda Guler", r: 79 },
    { n: "Joselu", r: 82 },
    { n: "Ter Stegen", r: 89 },
    { n: "Araujo", r: 86 },
    { n: "Kounde", r: 85 },
    { n: "Christensen", r: 83 },
    { n: "Cancelo", r: 85 },
    { n: "Balde", r: 81 },
    { n: "De Jong", r: 87 },
    { n: "Gundogan", r: 87 },
    { n: "Pedri", r: 86 },
    { n: "Gavi", r: 83 },
    { n: "Fermin", r: 78 },
    { n: "Romeu", r: 77 },
    { n: "Lewandowski", r: 90 },
    { n: "Raphinha", r: 83 },
    { n: "Felix", r: 82 },
    { n: "Ferran Torres", r: 81 },
    { n: "Yamal", r: 81 },
    { n: "Vitor Roque", r: 79 },
    { n: "Inigo Martinez", r: 81 },
    { n: "Pau Cubarsi", r: 79 },
    { n: "Inaki Pena", r: 77 },
    { n: "Oblak", r: 88 },
    { n: "Griezmann", r: 88 },
    { n: "Morata", r: 83 },
    { n: "Depay", r: 81 },
    { n: "Koke", r: 84 },
    { n: "De Paul", r: 84 },
    { n: "Llorente", r: 82 },
    { n: "Witsel", r: 81 },
    { n: "Gimenez", r: 83 },
    { n: "Hermoso", r: 82 },
    { n: "Molina", r: 82 },
    { n: "Lino", r: 80 },
    { n: "Riquelme", r: 78 },
    { n: "Barrios", r: 77 },
    { n: "Azpilicueta", r: 79 },
    { n: "Gabriel Paulista", r: 79 },
    { n: "Savic", r: 81 },
    { n: "Reinildo", r: 78 },
    { n: "Horatiu Moldovan", r: 78 },
    { n: "Arthur Vermeeren", r: 77 },
    { n: "Gabriel Gabriel", r: 76 },
    { n: "Unai Simon", r: 83 },
    { n: "Vivian", r: 79 },
    { n: "Yeray", r: 78 },
    { n: "Yuri", r: 78 },
    { n: "De Marcos", r: 78 },
    { n: "Vesga", r: 78 },
    { n: "Herrera", r: 79 },
    { n: "Sancet", r: 81 },
    { n: "Nico Williams", r: 83 },
    { n: "Inaki Williams", r: 82 },
    { n: "Guruzeta", r: 78 },
    { n: "Adu Ares", r: 75 },
    { n: "Agirrezabala", r: 76 },
    { n: "Remiro", r: 82 },
    { n: "Odriozola", r: 78 },
    { n: "Zubeldia", r: 80 },
    { n: "Le Normand", r: 83 },
    { n: "Tierney", r: 79 },
    { n: "Zubimendi", r: 84 },
    { n: "Merino", r: 84 },
    { n: "Brais Mendez", r: 82 },
    { n: "Kubo", r: 83 },
    { n: "Barrenetxea", r: 78 },
    { n: "Oyarzabal", r: 82 },
    { n: "Becker", r: 78 },
    { n: "Turrientes", r: 76 },
    { n: "Pacheco", r: 77 },
    { n: "Traore", r: 79 },
    { n: "Marcao", r: 77 },
    { n: "Nianzou", r: 76 },
    { n: "Gudelj", r: 79 },
    { n: "Ramos", r: 80 },
    { n: "Navas", r: 81 },
    { n: "Acuna", r: 81 },
    { n: "Jordan", r: 78 },
    { n: "Rakitic", r: 80 },
    { n: "Suso", r: 79 },
    { n: "Lamela", r: 79 },
    { n: "Ocampos", r: 80 },
    { n: "En-Nesyri", r: 82 },
    { n: "Lukebakio", r: 78 },
    { n: "Diaz", r: 77 },
    { n: "Soumare", r: 78 },
    { n: "Agoume", r: 76 },
    { n: "Vlachodimos", r: 79 },
    { n: "Nuno Tavares", r: 78 },
    { n: "Mandas", r: 75 },
    { n: "Pellegrini", r: 81 },
    { n: "Cheddira", r: 75 },
    { n: "Kaio Jorge", r: 74 },
    { n: "Soulé", r: 79 },
    { n: "Barrenechea", r: 75 },
    { n: "Huijsen", r: 75 },
    { n: "Turicchia", r: 72 }
];


// ======================= منطق اللعبة =======================
const TEAM_SIZE = 5;          // عدد لاعبي كل فريق
const MAX_PLAYERS = 4;
const ROUND_MS = 30000;       // مدة كل جولة
const EXTEND_WINDOW = 10000;  // إذا جاءت مزايدة في آخر 10 ثواني
const EXTEND_MS = 10000;      // يُضاف 10 ثواني
const RESULT_MS = 3500;       // مدة عرض نتيجة الجولة

// إزالة التكرار من القائمة (بالاسم)
const uniquePool = (() => {
    const m = new Map();
    for (const p of allPlayersPool) if (!m.has(p.n)) m.set(p.n, p);
    return [...m.values()];
})();

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const makeCode = () => Math.random().toString(36).substring(2, 7).toUpperCase();

function publicPlayers(room) {
    return room.players.map(p => ({
        id: p.id,
        name: p.name,
        budget: p.budget,
        teamCount: p.team.length,
        connected: p.connected !== false
    }));
}

// اللاعبون الذين يحق لهم أخذ البطاقة مجاناً
function grabbers(room) {
    const open = room.players.filter(p => p.team.length < TEAM_SIZE);
    if (open.length === 1) return [open[0].id];
    return open.filter(p => p.budget < 1).map(p => p.id);
}

function roundState(room) {
    return {
        card: { n: room.currentCard.n },
        bid: room.currentBid,
        lead: room.currentLead,
        remaining: Math.max(0, room.endsAt - Date.now()),
        players: publicPlayers(room),
        grabs: grabbers(room),
        round: room.currentRound,
        teamSize: TEAM_SIZE
    };
}

function scheduleSettle(code) {
    const room = rooms[code];
    if (!room) return;
    if (room.roundTimer) clearTimeout(room.roundTimer);
    room.roundTimer = setTimeout(() => settle(code, null), Math.max(0, room.endsAt - Date.now()));
}

function startNextRound(code) {
    const room = rooms[code];
    if (!room || room.status !== 'playing') return;

    const open = room.players.filter(p => p.team.length < TEAM_SIZE);
    if (!open.length || !room.deck.length) return endGame(code);

    room.currentCard = room.deck.shift();
    room.currentRound++;
    room.currentBid = 0;
    room.currentLead = -1;
    room.endsAt = Date.now() + ROUND_MS;
    room.phase = 'bidding';

    scheduleSettle(code);
    io.to(code).emit('round-started', roundState(room));
}

function settle(code, grabberIndex) {
    const room = rooms[code];
    if (!room || room.phase !== 'bidding') return;
    room.phase = 'result';
    if (room.roundTimer) clearTimeout(room.roundTimer);

    let message;
    if (grabberIndex !== null && grabberIndex !== undefined) {
        const w = room.players[grabberIndex];
        w.team.push({ ...room.currentCard, price: 0 });
        message = `${w.name} أخذ اللاعب ${room.currentCard.n} مجاناً!`;
    } else if (room.currentLead >= 0 && room.currentBid > 0) {
        const w = room.players[room.currentLead];
        w.budget -= room.currentBid;
        w.team.push({ ...room.currentCard, price: room.currentBid });
        message = `تم بيع اللاعب ${room.currentCard.n} إلى ${w.name} مقابل ${room.currentBid} ريال!`;
    } else {
        message = `لم يزاود أحد على اللاعب ${room.currentCard.n}، تم تخطيه!`;
    }

    io.to(code).emit('round-result', {
        card: { n: room.currentCard.n },
        message,
        players: publicPlayers(room)
    });

    room.roundTimer = setTimeout(() => startNextRound(code), RESULT_MS);
}

function endGame(code) {
    const room = rooms[code];
    if (!room) return;
    room.status = 'ended';
    room.phase = 'ended';
    if (room.roundTimer) clearTimeout(room.roundTimer);
    io.to(code).emit('auction-ended', {
        hostId: room.host,
        players: room.players.map(p => ({ id: p.id, name: p.name, budget: p.budget, team: p.team }))
    });
    // حذف الغرفة بعد 15 دقيقة
    setTimeout(() => { delete rooms[code]; }, 15 * 60 * 1000);
}

io.on('connection', (socket) => {
    console.log('مستخدم متصل:', socket.id);

    const lobbyPayload = (room) => ({
        players: room.players.map(p => ({ id: p.id, name: p.name })),
        hostId: room.host
    });

    socket.on('create-room', (playerName) => {
        let code = makeCode();
        while (rooms[code]) code = makeCode();
        const name = String(playerName || '').trim().slice(0, 16) || 'لاعب 1';
        rooms[code] = {
            host: socket.id,
            players: [{ id: socket.id, name, team: [], budget: 0, connected: true }],
            status: 'waiting',
            phase: 'waiting',
            deck: [],
            currentBid: 0,
            currentLead: -1,
            currentCard: null,
            roundTimer: null,
            endsAt: 0,
            currentRound: 0
        };
        socket.join(code);
        socket.emit('room-created', code);
        io.to(code).emit('update-lobby', lobbyPayload(rooms[code]));
    });

    socket.on('join-room', (data) => {
        const code = String((data && data.roomCode) || data || '').trim().toUpperCase();
        const room = rooms[code];
        if (!room) return socket.emit('error-msg', 'الغرفة غير موجودة!');
        if (room.status !== 'waiting') return socket.emit('error-msg', 'اللعبة قد بدأت بالفعل!');
        if (room.players.length >= MAX_PLAYERS) return socket.emit('error-msg', 'الغرفة ممتلئة!');
        if (room.players.some(p => p.id === socket.id)) return;

        const name = String((data && data.playerName) || '').trim().slice(0, 16) || `لاعب ${room.players.length + 1}`;
        room.players.push({ id: socket.id, name, team: [], budget: 0, connected: true });
        socket.join(code);
        socket.emit('joined', code);
        io.to(code).emit('update-lobby', lobbyPayload(room));
    });

    socket.on('start-game', (code) => {
        const room = rooms[code];
        if (!room || room.host !== socket.id || room.status !== 'waiting') return;
        if (room.players.length < 2) return socket.emit('error-msg', 'يجب أن يكون هناك لاعبان على الأقل!');

        const budget = 20 + Math.floor(Math.random() * 31); // 20 - 50 ريال، نفس الميزانية للجميع
        room.players.forEach(p => { p.budget = budget; p.team = []; });
        room.deck = shuffle(uniquePool.map(p => ({ ...p })));
        room.status = 'playing';
        room.currentRound = 0;
        startNextRound(code);
    });

    socket.on('place-bid', ({ roomCode } = {}) => {
        const room = rooms[roomCode];
        if (!room || room.status !== 'playing' || room.phase !== 'bidding') return;

        // اللاعب يُحدَّد من اتصاله هو، فلا يستطيع المزايدة باسم غيره
        const idx = room.players.findIndex(p => p.id === socket.id);
        if (idx < 0) return;
        const bidder = room.players[idx];
        if (room.currentLead === idx) return;
        if (bidder.team.length >= TEAM_SIZE) return;
        const nextBid = room.currentBid + 1;
        if (bidder.budget < nextBid) return;

        room.currentBid = nextBid;
        room.currentLead = idx;

        // تمديد الوقت إذا كانت المزايدة في آخر 10 ثواني
        if (room.endsAt - Date.now() <= EXTEND_WINDOW) {
            room.endsAt += EXTEND_MS;
            scheduleSettle(roomCode);
        }

        io.to(roomCode).emit('update-auction', {
            bid: room.currentBid,
            lead: room.currentLead,
            remaining: Math.max(0, room.endsAt - Date.now())
        });
    });

    socket.on('grab', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.status !== 'playing' || room.phase !== 'bidding') return;
        if (!grabbers(room).includes(socket.id)) return;
        const idx = room.players.findIndex(p => p.id === socket.id);
        if (idx >= 0) settle(roomCode, idx);
    });

    socket.on('start-reveal', (roomCode) => {
        const room = rooms[roomCode];
        if (!room || room.status !== 'ended' || room.host !== socket.id) return;
        io.to(roomCode).emit('run-reveal');
    });

    socket.on('disconnect', () => {
        console.log('انقطع الاتصال:', socket.id);
        for (const code of Object.keys(rooms)) {
            const room = rooms[code];
            const idx = room.players.findIndex(p => p.id === socket.id);
            if (idx < 0) continue;

            if (room.status === 'waiting') {
                room.players.splice(idx, 1);
                if (!room.players.length) { delete rooms[code]; break; }
                if (room.host === socket.id) room.host = room.players[0].id;
                io.to(code).emit('update-lobby', lobbyPayload(room));
            } else {
                room.players[idx].connected = false;
                const alive = room.players.filter(p => p.connected !== false);
                if (!alive.length) {
                    if (room.roundTimer) clearTimeout(room.roundTimer);
                    delete rooms[code];
                } else if (room.host === socket.id) {
                    room.host = alive[0].id;
                }
            }
            break;
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`السيرفر يعمل بنجاح على المنفذ ${PORT}`);
});
