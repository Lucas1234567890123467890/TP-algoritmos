document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playlistElement = document.getElementById('playlist');
    const currentTrackTitleElement = document.getElementById('current-track-title');
    const currentTrackInfoElement = document.getElementById('current-track-info');
    const searchInput = document.getElementById('search-input');
    const gameFilter = document.getElementById('game-filter');

    if (audioPlayer) {
        const tracks = [
            { title: "Vs. Magno, Equipo Magma/Aquiles, Equipo Aqua", game: "Rubí/Zafiro/Esmeralda", boss: "Magno & Aquiles", src: "music/Musica_Magno_Aquiles.mp3" },
            { title: "Vs. Magno, Equipo Magma/Aquiles, Equipo Aqua", game: "Rubi Omega/Zafiro Alfa", boss: "Magno & Aquiles", src: "music/Musica_Magno_Aquiles(ORAS).mp3" },
            { title: "Vs. Helio, Equipo Galaxia", game: "Diamante/Perla/Platino", boss: "Helio", src: "music/Musica_Helio.mp3" },
            { title: "Vs. Ghetsis, Equipo Plasma", game: "Blanco/Negro", boss: "Ghetsis", src: "music/Musica_Ghetsis.mp3" },
            { title: "Vs. N, Equipo Plasma", game: "Blanco/Negro", boss: "N", src: "music/Musica_N.mp3" },
            { title: "Vs. Ghetsis, Neo Equipo Plasma", game: "Blanco2/Negro2", boss: "Ghetsis", src: "music/Musica_Ghetsis2.mp3" },
            { title: "Vs. Lyson, Team Flare", game: "X/Y", boss: "Lyson", src: "music/Musica_Lyson.mp3" },
            { title: "Vs. Líder del Team Skull, Guzman", game: "Sol/Luna", boss: "Guzman", src: "music/Musica_Guzman.mp3" },
            { title: "Vs. Presidenta Aether, Samina", game: "Sol/Luna", boss: "Samina", src: "music/Musica_Samina.mp3" },
            { title: "Vs. MacroCosmos Rose", game: "Espada/Escudo", boss: "MacroCosmos Rose", src: "music/Musica_Rose.mp3" },
        ];

        let currentTrackIndex = -1;
        let currentlyPlayingLi = null;

        function populateGameFilter() {
            const games = [...new Set(tracks.map(track => track.game))].sort();
            games.forEach(game => {
                const option = document.createElement('option');
                option.value = game;
                option.textContent = game;
                gameFilter.appendChild(option);
            });
        }

        function renderPlaylist(filteredTracks = tracks) {
            playlistElement.innerHTML = '';
            filteredTracks.forEach((track) => {
                const originalIndex = tracks.findIndex(t => t.src === track.src);

                const li = document.createElement('li');
                li.innerHTML = `<strong>${track.title}</strong><span>Juego: ${track.game} | Villano: ${track.boss}</span>`;
                li.dataset.index = originalIndex;

                if (originalIndex === currentTrackIndex) {
                    li.classList.add('active');
                    currentlyPlayingLi = li;
                }

                li.addEventListener('click', () => {
                    playTrack(originalIndex);
                });
                playlistElement.appendChild(li);
            });
        }

        function playTrack(index) {
            if (index < 0 || index >= tracks.length) return;
            currentTrackIndex = index;
            const track = tracks[index];
            audioPlayer.src = track.src;
            audioPlayer.load();
            audioPlayer.play().catch(error => console.error("Error al reproducir:", error));
            currentTrackTitleElement.textContent = track.title;
            currentTrackInfoElement.textContent = `Juego: ${track.game} | Villano: ${track.boss}`;
            if (currentlyPlayingLi) {
                currentlyPlayingLi.classList.remove('active');
            }
            const newActiveLi = Array.from(playlistElement.children).find(li => parseInt(li.dataset.index) === index);
            if (newActiveLi) {
                newActiveLi.classList.add('active');
                currentlyPlayingLi = newActiveLi;
            }
        }

        function filterAndSearchTracks() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedGame = gameFilter.value;

            const filtered = tracks.filter(track => {
                const matchesSearch = track.title.toLowerCase().includes(searchTerm) ||
                                      track.game.toLowerCase().includes(searchTerm) ||
                                      track.boss.toLowerCase().includes(searchTerm);
                const matchesGame = selectedGame === "" || track.game === selectedGame;
                return matchesSearch && matchesGame;
            });
            renderPlaylist(filtered);
        }

        audioPlayer.addEventListener('ended', () => {
            currentTrackTitleElement.textContent = "Selecciona una canción";
            currentTrackInfoElement.textContent = "Juego: - | Villano: -";
            if (currentlyPlayingLi) {
                currentlyPlayingLi.classList.remove('active');
                currentlyPlayingLi = null;
            }
            currentTrackIndex = -1;
        });

        searchInput.addEventListener('input', filterAndSearchTracks);
        gameFilter.addEventListener('change', filterAndSearchTracks);

        populateGameFilter();
        renderPlaylist();
    }
});


const searchForm = document.getElementById('search-form');
const pokemonInput = document.getElementById('pokemon-input');
const resultContainer = document.getElementById('pokemon-result-container');

if(searchForm) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const pokemonQuery = pokemonInput.value.toLowerCase().trim();

        if (pokemonQuery === '') {
            displayError("Por favor, escribe el nombre o número de un Pokémon.");
            return;
        }
        fetchPokemonData(pokemonQuery);
    });

    async function fetchPokemonData(query) {
        const url = `https://pokeapi.co/api/v2/pokemon/${query}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('No se encontró el Pokémon. ¡Intenta con otro!');
            }
            const data = await response.json();
            displayPokemonData(data);
        } catch (error) {
            displayError(error.message);
        }
    }

    function displayPokemonData(pokemon) {
        resultContainer.innerHTML = '';
        pokemonInput.value = '';

        const name = pokemon.name;
        const id = pokemon.id;
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
        const types = pokemon.types.map(typeInfo => typeInfo.type.name);

        const pokemonCardHTML = `
            <div class="pokemon-card">
                <img src="${imageUrl}" alt="Imagen de ${name}">
                <h2>#${id} - ${name}</h2>
                <div class="pokemon-types">
                    ${types.map(type => `<span class="type-badge ${type}">${type}</span>`).join('')}
                </div>
            </div>`;
        resultContainer.innerHTML = pokemonCardHTML;
    }

    function displayError(message) {
        resultContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }
}