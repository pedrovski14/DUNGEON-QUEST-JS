kaboom({
    background: [1, 1, 1],
    fullscreen: true,
})

loadSprite("caverna", "./assets/caverna.jpg")
loadSprite("jogador", "./assets/cavaleiro.webp")
loadSprite("jogador1", "./assets/cavaleiro2.png")
loadSprite("ghost", "./assets/ghost1.png")
loadSprite("menu", "./assets/darkfantasy1.png")
//loadsound("music","./sounds/quest master.mp3")
loadSound("song", "./assets/songrpg.mp3")
loadSprite("win", "./assets/winner.jpg")
loadSprite("gm", "./assets/gm.jpg")
loadSprite("catacumba", "./assets/catacumba.png")
loadSprite("dragon1", "./assets/dragon1.png")
loadSprite("dragon2", "./assets/dragon2.png")
loadSound("battle", "./assets/battle.mp3")




scene("main", () => {
    add([sprite("caverna"), pos(0, 0), z(-1)]);
   
    // Função para adicionar pontos
    function addScore(points) {
        score += points;
        scoreLabel.value = score;
        scoreLabel.text = "Pontos: " + score;
    }
    let score = 0;  
    let life = 3;
    const scoreLabel = add([
        text("Pontos: " +score),
        pos(12, 12),
        {
            value: score,
        },
    ]); 
    const lifeLabel = add([
        text("Vida: " +life),
        pos(width() - 150, 12),
        {
            value: life,
        },
        
    ]);




    loadSound("song", "./assets/songrpg.mp3")
    const music = play("song", { loop: true, volume: 10.0 })

    // Audio no Jogo
    //const hitSonew Audio("./assets/songrpg.mp3");
    //hitSound.play();


    const jogador = add([
        sprite("jogador"),
        area(),
        pos(width() / 2, height() - 256),
        anchor("center"), // anchor é o centro da imagem
        scale(0.5),
        'jogador', // Tag para identificar o jogador

    ])

    const SPEED = 500
    onKeyDown("left", () => {
        jogador.move(-SPEED, 0);

    });
    onKeyDown("right", () => {
        jogador.move(SPEED, 0);
    });
    onKeyDown("up", () => {
        jogador.move(0, -SPEED);
    });
    onKeyDown("down", () => {
        jogador.move(0, SPEED);
    });

    let isAttacking = false; // Variável para verificar se está atacando
    onKeyDown("space", () => {
        jogador.use(sprite("jogador1"));
        isAttacking = true;
    });

    onKeyRelease("space", () => {
        jogador.use(sprite("jogador"));
        isAttacking = false;
    });

    function fghost() {
        const ghost = add([
            sprite("ghost"),
            area({ width: 60, height: 60 }),
            // Posição inicial aleatória: ou da esquerda (-32) ou da direita (width() + 32)
            // e posição Y aleatória na tela
            pos(rand(0, 1) > 0.5 ? -32 : width() + 32, rand(32, height() - 32)),
            anchor("center"),
            // Move para a direita (se veio da esquerda) ou para a esquerda (se veio da direita)
            move(LEFT, rand(150, 250)),
            "ghost",
            scale(0.5)
        ]);
        ghost.onCollide("jogador", () => {
            if (isAttacking) {
            destroy(ghost);
            addScore(1); // Adiciona 1 ponto ao destruir o fantasma
            if (score >= 7) {
                go("fase2"); // Vai para a cena de vitória ao matar 7 fantasmas
            }
            } else {
            life -= 1;
            lifeLabel.value = life;
            lifeLabel.text = "Vida: " + life;

            if (life <= 0) {
                go("gameover");
            }
            }
        });
        ghost.onCollide("jogador", () => {
            if (isAttacking) {
                // Se o jogador está atacando, destrói o fantasma
                destroy(ghost);
            } else {
                // Se o jogador não está atacando, perde vida
                life -= 1;
                lifeLabel.value = life;
                lifeLabel.text = "Vida: " + life;

                if (life <= 0) {
                    // Se a vida chegar a zero, vai para a cena de game over
                    go("gameover");
                }
               
 
            }
        });
    }

    loop(1, fghost);

})

scene("fase2", () => {
    add([sprite("catacumba"), pos(0, 0), z(-1)]);

    let score = 0;
    let life = 3;
    const scoreLabel = add([
        text("Pontos: " + score),
        pos(12, 12),
        { value: score },
    ]);
    const lifeLabel = add([
        text("Vida: " + life),
        pos(width() - 150, 12),
        { value: life },
    ]);

    loadSound("battle", "./assets/battle.mp3")
    const music = play("battle", { loop: true, volume: 10.0 })

  

    const jogador = add([
        sprite("jogador"),
        area(),
        pos(width() / 2, height() - 256),
        anchor("center"),
        scale(0.5),
        'jogador',
    ]);

    const SPEED = 600;
    onKeyDown("left", () => jogador.move(-SPEED, 0));
    onKeyDown("right", () => jogador.move(SPEED, 0));
    onKeyDown("up", () => jogador.move(0, -SPEED));
    onKeyDown("down", () => jogador.move(0, SPEED));

    let isAttacking = false;
    onKeyDown("space", () => {
        jogador.use(sprite("jogador1"));
        isAttacking = true;
    });
    onKeyRelease("space", () => {
        jogador.use(sprite("jogador"));
        isAttacking = false;
    });

    function addScore(points) {
        score += points;
        scoreLabel.value = score;
        scoreLabel.text = "Pontos: " + score;
    }

    // Carregue os sprites do dragão (parado e atacando) no início do arquivo:
    // loadSprite("dragon_idle", "./assets/dragon_idle.png")
    // loadSprite("dragon_attack", "./assets/dragon_attack.png")

    function fdragon() {
        // Cria o dragão com sprite parado inicialmente
        const dragon = add([
            sprite("dragon1"),
            area({ width: 120, height: 80 }),
            pos(rand(0, 1) > 0.5 ? -64 : width() + 64, rand(64, height() - 64)),
            anchor("center"),
            move(LEFT, rand(180, 250)),
            "dragon",
            scale(0.8)
        ]);

        // Troca para sprite de ataque ao colidir com o jogador
        dragon.onCollide("jogador", () => {
            dragon.use(sprite("dragon2"));
            if (isAttacking) {
                destroy(dragon);
                addScore(3); // Mais pontos por dragão
                if (score >= 14) {
                    go("win");
                }
            } else {
                life -= 1;
                lifeLabel.value = life;
                lifeLabel.text = "Vida: " + life;
                if (life <= 0) {
                    go("gameover");
                }
            }
        });
    }

    // Adicione a função fghost para a fase2 (copiada da main, se necessário)
    function fghost() {
        const ghost = add([
            sprite("ghost"),
            area({ width: 60, height: 60 }),
            pos(rand(0, 1) > 0.5 ? -32 : width() + 32, rand(32, height() - 32)),
            anchor("center"),
            move(LEFT, rand(150, 250)),
            "ghost",
            scale(0.5)
        ]);
        ghost.onCollide("jogador", () => {
            if (isAttacking) {
                destroy(ghost);
                addScore(1);
                if (score >= 14) {
                    go("win");
                }
            } else {
                life -= 1;
                lifeLabel.value = life;
                lifeLabel.text = "Vida: " + life;
                if (life <= 0) {
                    go("gameover");
                }
            }
        });
    }

    loop(0.7, fghost); // Mais fantasmas na fase 2
    loop(2, fdragon); // Adiciona dragões na fase 2
});


scene("gameover", () => {
    add([
        sprite("gm"),
        pos(0, 0),
        z(-1)
    ]);
    add([
        text("Você Perdeu!", { size: 48 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 255, 255),
    ]);
    onKeyDown("space", () => {
        go("main"); // Volta para o menu principal ao pressionar espaço
    });
    wait(2, () => go("menu")); // Volta para o menu após 2 segundos
})

scene("menu", () => {
    add([
        sprite("menu"),
        pos(0, 0),
        z(-1),
    ]);
    const startButton = add([
        text("Pressione Espaco para Começar", { size: 24 }),
        pos(width() / 2, height() - 50),
        anchor("center"),
        color(255, 255, 255),
    ]);

    onKeyDown("space", () => {
        go("main"); // Inicia o jogo ao pressionar espaço
    });
})

scene("win", () => {
    add([
        sprite("win"),
        pos(0, 0),
        z(-1)
    ]);
    const winLabel = add([
        text("Você Venceu!", { size: 48 }),
        pos(width() / 2, height() / 2),
        anchor("center"),
        color(255, 255, 255),
    ]);
    onKeyDown("enter", () => {
        go("menu"); // Volta para o menu ao pressionar espaço
    });
},



go("menu")) // Inicia na cena do menu
 