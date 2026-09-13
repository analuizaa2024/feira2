const canvas = document.getElementById("florCanvas");
const ctx = canvas.getContext("2d");

let animationStart = null;

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const CONFIG = {
    scaleBase: 370,

    animation: {
        stem: 1200,
        leaves: 500,
        flower: 850,
        center: 2300,
        hearts: 3100,
        text: 3500
    },

    /* Fundo totalmente transparente */
    transparentBackground: true
};


/* =========================================================
   PALETAS
   Tons mais delicados para combinar com o site
========================================================= */

const rosePalettes = {

    outer: {
        dark: "#55152d",
        base: "#8f3156",
        mid: "#b95778",
        light: "#d77f9b",
        highlight: "#edb0c2"
    },

    middle: {
        dark: "#641936",
        base: "#a43d62",
        mid: "#c45b7d",
        light: "#dc819b",
        highlight: "#efb5c6"
    },

    inner: {
        dark: "#731c3e",
        base: "#b4486c",
        mid: "#cf6687",
        light: "#e28da5",
        highlight: "#f2bdcc"
    },

    core: {
        dark: "#481126",
        base: "#7d2148",
        mid: "#a93d64",
        light: "#ca6385",
        highlight: "#e99caf"
    }
};


/* =========================================================
   CAMADAS DA ROSA
========================================================= */

const roseLayers = [

    {
        count: 12,
        start: 800,
        duration: 1200,
        length: 125,
        width: 57,
        rotation: 0.08,
        palette: rosePalettes.outer
    },

    {
        count: 10,
        start: 1020,
        duration: 1100,
        length: 108,
        width: 51,
        rotation: Math.PI / 10,
        palette: rosePalettes.middle
    },

    {
        count: 8,
        start: 1250,
        duration: 1000,
        length: 88,
        width: 45,
        rotation: Math.PI / 8,
        palette: rosePalettes.inner
    },

    {
        count: 7,
        start: 1480,
        duration: 900,
        length: 68,
        width: 37,
        rotation: Math.PI / 7,
        palette: rosePalettes.core
    },

    {
        count: 5,
        start: 1740,
        duration: 820,
        length: 45,
        width: 28,
        rotation: Math.PI / 5,
        palette: rosePalettes.core
    }
];


/* =========================================================
   CORAÇÕES
========================================================= */

const hearts = [
    { x: -205, y: -120, size: 9 },
    { x: 190, y: -105, size: 10 },
    { x: -180, y: 10, size: 7 },
    { x: 205, y: 45, size: 9 },
    { x: -135, y: 145, size: 8 },
    { x: 145, y: 150, size: 8 },
    { x: 220, y: -20, size: 7 },
    { x: -225, y: 65, size: 7 },
    { x: 95, y: -175, size: 6 },
    { x: -65, y: -180, size: 6 }
];


/* =========================================================
   UTILITÁRIOS
========================================================= */

function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

function easeOutCubic(t) {
    t = clamp(t);
    return 1 - Math.pow(1 - t, 3);
}

function easeOutQuart(t) {
    t = clamp(t);
    return 1 - Math.pow(1 - t, 4);
}

function easeInOut(t) {
    t = clamp(t);

    if (t < 0.5) {
        return 4 * t * t * t;
    }

    return 1 - Math.pow(-2 * t + 2, 3) / 2;
}


/* =========================================================
   RESIZE
========================================================= */

function resizeCanvas() {

    const rect =
        canvas.parentElement.getBoundingClientRect();

    canvas.width = Math.max(1, rect.width);
    canvas.height = Math.max(1, rect.height);

    animationStart = null;
}


/* =========================================================
   FUNDO TRANSPARENTE
========================================================= */

function clearCanvas() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}


/* =========================================================
   CAULE
========================================================= */

function getStemPoint(cx, cy, scale, t) {

    const startX = cx + 8 * scale;
    const startY = cy + 240 * scale;

    const c1x = cx + 48 * scale;
    const c1y = cy + 165 * scale;

    const c2x = cx - 45 * scale;
    const c2y = cy + 82 * scale;

    const endX = cx;
    const endY = cy + 4 * scale;

    const x =
        Math.pow(1 - t, 3) * startX +
        3 * Math.pow(1 - t, 2) * t * c1x +
        3 * (1 - t) * Math.pow(t, 2) * c2x +
        Math.pow(t, 3) * endX;

    const y =
        Math.pow(1 - t, 3) * startY +
        3 * Math.pow(1 - t, 2) * t * c1y +
        3 * (1 - t) * Math.pow(t, 2) * c2y +
        Math.pow(t, 3) * endY;

    return { x, y };
}


function drawStem(cx, cy, scale, progress) {

    if (progress <= 0) return;

    const p = easeInOut(progress);

    const start = getStemPoint(
        cx,
        cy,
        scale,
        0
    );

    const current = getStemPoint(
        cx,
        cy,
        scale,
        p
    );

    ctx.save();

    /*
       Sombra bem discreta
       para não ficar pesada em fundo claro
    */

    ctx.shadowColor =
        "rgba(70, 35, 50, 0.18)";

    ctx.shadowBlur =
        4 * scale;

    ctx.shadowOffsetX =
        1 * scale;

    ctx.shadowOffsetY =
        2 * scale;

    const gradient =
        ctx.createLinearGradient(
            start.x,
            start.y,
            current.x,
            current.y
        );

    gradient.addColorStop(
        0,
        "#36583f"
    );

    gradient.addColorStop(
        0.4,
        "#527653"
    );

    gradient.addColorStop(
        0.75,
        "#73956a"
    );

    gradient.addColorStop(
        1,
        "#91aa7c"
    );

    ctx.strokeStyle = gradient;

    ctx.lineWidth =
        4.5 * scale;

    ctx.lineCap = "round";

    ctx.beginPath();

    ctx.moveTo(
        start.x,
        start.y
    );

    ctx.bezierCurveTo(
        cx + 48 * scale,
        cy + 165 * scale,

        cx - 45 * scale,
        cy + 82 * scale,

        current.x,
        current.y
    );

    ctx.stroke();

    ctx.restore();
}


/* =========================================================
   FOLHAS
========================================================= */

function drawLeaf(
    x,
    y,
    angle,
    length,
    width,
    progress,
    scale
) {

    if (progress <= 0) return;

    const p = easeOutQuart(progress);

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(p, p);

    ctx.shadowColor =
        "rgba(40, 55, 40, 0.15)";

    ctx.shadowBlur =
        5 * scale;

    ctx.shadowOffsetX =
        1 * scale;

    ctx.shadowOffsetY =
        2 * scale;

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            length,
            0
        );

    gradient.addColorStop(
        0,
        "#405f45"
    );

    gradient.addColorStop(
        0.35,
        "#5d7d58"
    );

    gradient.addColorStop(
        0.7,
        "#79986c"
    );

    gradient.addColorStop(
        1,
        "#9db48b"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.moveTo(0, 0);

    ctx.bezierCurveTo(
        length * 0.18, -width * 0.65,

        length * 0.62, -width,

        length, -width * 0.05
    );

    ctx.bezierCurveTo(
        length * 0.68,
        width * 0.75,

        length * 0.30,
        width * 0.72,

        0,
        0
    );

    ctx.closePath();

    ctx.fill();

    ctx.shadowColor = "transparent";

    /*
       Nervura muito suave.
       Não é mais aquela linha branca forte.
    */

    ctx.strokeStyle =
        "rgba(235, 242, 226, 0.18)";

    ctx.lineWidth =
        Math.max(
            0.7 * scale,
            0.5
        );

    ctx.beginPath();

    ctx.moveTo(
        2 * scale,
        0
    );

    ctx.quadraticCurveTo(
        length * 0.45, -1 * scale,

        length * 0.90,
        0
    );

    ctx.stroke();

    for (let i = 1; i <= 4; i++) {

        const t = i / 5;

        const px = length * t;

        const spread =
            width *
            Math.sin(t * Math.PI) *
            0.35;

        ctx.beginPath();

        ctx.moveTo(px, 0);

        ctx.lineTo(
            px - length * 0.10, -spread
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(px, 0);

        ctx.lineTo(
            px - length * 0.10,
            spread
        );

        ctx.stroke();
    }

    ctx.restore();
}


/* =========================================================
   FORMATO DAS PÉTALAS
========================================================= */

function createPetalPath(L, W, curl) {

    const path = new Path2D();

    path.moveTo(0, 0);

    path.bezierCurveTo(
        L * 0.12, -W * 0.28,

        L * 0.22, -W * (0.85 + curl),

        L * 0.45, -W * (0.95 + curl)
    );

    path.bezierCurveTo(
        L * 0.67, -W,

        L * 0.90, -W * 0.55,

        L, -W * 0.08
    );

    path.bezierCurveTo(
        L * 1.02,
        0,

        L * 0.99,
        W * 0.18,

        L * 0.93,
        W * 0.42
    );

    path.bezierCurveTo(
        L * 0.78,
        W * 0.86,

        L * 0.55,
        W * (1 + curl),

        L * 0.35,
        W * 0.80
    );

    path.bezierCurveTo(
        L * 0.17,
        W * 0.58,

        L * 0.08,
        W * 0.20,

        0,
        0
    );

    path.closePath();

    return path;
}


/* =========================================================
   PÉTALA REALISTA
========================================================= */

function drawRosePetal(
    cx,
    cy,
    angle,
    length,
    width,
    progress,
    palette,
    scale,
    layerIndex,
    petalIndex
) {

    if (progress <= 0) return;

    const p = easeOutCubic(progress);

    const L = length * p;
    const W = width * p;

    if (L < 1) return;

    ctx.save();

    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const variation =
        Math.sin(
            petalIndex * 4.37 +
            layerIndex * 2.19
        ) * 0.06;

    const curl =
        0.05 + variation;

    /*
       Sombra mais elegante
    */

    ctx.shadowColor =
        "rgba(80, 25, 45, 0.20)";

    ctx.shadowBlur =
        7 * scale * p;

    ctx.shadowOffsetX =
        1 * scale;

    ctx.shadowOffsetY =
        3 * scale;

    const gradient =
        ctx.createRadialGradient(
            L * 0.28, -W * 0.18,
            Math.max(1, W * 0.05),

            L * 0.62,
            0,
            L * 1.15
        );

    gradient.addColorStop(
        0,
        palette.highlight
    );

    gradient.addColorStop(
        0.18,
        palette.light
    );

    gradient.addColorStop(
        0.48,
        palette.mid
    );

    gradient.addColorStop(
        0.78,
        palette.base
    );

    gradient.addColorStop(
        1,
        palette.dark
    );

    ctx.fillStyle = gradient;

    const path =
        createPetalPath(
            L,
            W,
            curl
        );

    ctx.fill(path);

    /*
       Reflexo MUITO suave
       para deixar a pétala sofisticada
    */

    ctx.shadowColor = "transparent";

    const light =
        ctx.createLinearGradient(
            0, -W,
            L,
            W
        );

    light.addColorStop(
        0,
        "rgba(255,255,255,0.10)"
    );

    light.addColorStop(
        0.35,
        "rgba(255,220,230,0.035)"
    );

    light.addColorStop(
        0.70,
        "rgba(255,255,255,0)"
    );

    ctx.fillStyle = light;

    ctx.fill(path);

    /*
       Borda quase imperceptível.
       Nada de contorno branco.
    */

    ctx.globalAlpha =
        0.12 * p;

    ctx.strokeStyle =
        "rgba(255,220,230,0.20)";

    ctx.lineWidth =
        Math.max(
            0.7 * scale,
            0.5
        );

    ctx.stroke(path);

    ctx.restore();
}


/* =========================================================
   PÉTALAS INTERNAS
========================================================= */

function drawInnerCurl(
    cx,
    cy,
    scale,
    progress,
    index
) {

    if (progress <= 0) return;

    const p =
        easeOutQuart(progress);

    const angle =
        index *
        (Math.PI * 2 / 5);

    const distance =
        7 * scale;

    const x =
        cx +
        Math.cos(angle) *
        distance;

    const y =
        cy +
        Math.sin(angle) *
        distance;

    const length =
        39 * scale;

    const width =
        22 * scale;

    ctx.save();

    ctx.translate(x, y);

    ctx.rotate(
        angle + 0.7
    );

    ctx.scale(p, p);

    const gradient =
        ctx.createLinearGradient(
            0, -width,
            length,
            width
        );

    gradient.addColorStop(
        0,
        "#501329"
    );

    gradient.addColorStop(
        0.35,
        "#762044"
    );

    gradient.addColorStop(
        0.72,
        "#aa3e62"
    );

    gradient.addColorStop(
        1,
        "#d67490"
    );

    ctx.fillStyle = gradient;

    ctx.shadowColor =
        "rgba(70,20,40,0.20)";

    ctx.shadowBlur =
        6 * scale;

    ctx.beginPath();

    ctx.moveTo(0, 0);

    ctx.bezierCurveTo(
        length * 0.20, -width * 0.80,

        length * 0.58, -width,

        length, -width * 0.20
    );

    ctx.bezierCurveTo(
        length * 0.80,
        width * 0.45,

        length * 0.35,
        width * 0.90,

        0,
        0
    );

    ctx.closePath();

    ctx.fill();

    ctx.restore();
}


/* =========================================================
   CENTRO
========================================================= */

function drawRoseCenter(
    cx,
    cy,
    scale,
    progress
) {

    if (progress <= 0) return;

    const p =
        easeOutQuart(progress);

    ctx.save();

    ctx.translate(cx, cy);
    ctx.scale(p, p);

    const gradient =
        ctx.createRadialGradient(
            0,
            0,
            0,

            0,
            0,
            21 * scale
        );

    gradient.addColorStop(
        0,
        "#35101f"
    );

    gradient.addColorStop(
        0.28,
        "#59142f"
    );

    gradient.addColorStop(
        0.56,
        "#792044"
    );

    gradient.addColorStop(
        0.82,
        "#a03d5f"
    );

    gradient.addColorStop(
        1,
        "#ca6884"
    );

    ctx.fillStyle = gradient;

    ctx.shadowColor =
        "rgba(60,20,40,0.25)";

    ctx.shadowBlur =
        11 * scale;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        17 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowColor =
        "transparent";

    for (let i = 0; i < 5; i++) {

        const a =
            i *
            (Math.PI * 2 / 5) +
            0.3;

        const px =
            Math.cos(a) *
            8 *
            scale;

        const py =
            Math.sin(a) *
            6 *
            scale;

        ctx.save();

        ctx.translate(px, py);

        ctx.rotate(a + 0.8);

        const curlGradient =
            ctx.createLinearGradient(-8 * scale,
                0,

                10 * scale,
                0
            );

        curlGradient.addColorStop(
            0,
            "#481027"
        );

        curlGradient.addColorStop(
            0.48,
            "#84244a"
        );

        curlGradient.addColorStop(
            0.80,
            "#b54d6e"
        );

        curlGradient.addColorStop(
            1,
            "#e0849d"
        );

        ctx.fillStyle =
            curlGradient;

        ctx.beginPath();

        ctx.ellipse(
            0,
            0,
            10 * scale,
            5.5 * scale,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }

    ctx.restore();
}


/* =========================================================
   SOMBRA
========================================================= */

function drawFlowerShadow(
    cx,
    cy,
    scale,
    progress
) {

    if (progress <= 0) return;

    const p =
        easeOutCubic(progress);

    ctx.save();

    ctx.globalAlpha =
        0.10 * p;

    const gradient =
        ctx.createRadialGradient(
            cx,
            cy + 235 * scale,
            0,

            cx,
            cy + 235 * scale,
            90 * scale
        );

    gradient.addColorStop(
        0,
        "rgba(60,30,45,0.30)"
    );

    gradient.addColorStop(
        1,
        "rgba(60,30,45,0)"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.ellipse(
        cx,
        cy + 235 * scale,
        75 * scale,
        17 * scale,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.restore();
}


/* =========================================================
   CORAÇÕES
========================================================= */

function drawHearts(
    cx,
    cy,
    scale,
    progress,
    elapsed
) {

    if (progress <= 0) return;

    ctx.save();

    hearts.forEach(
        (heart, index) => {

            const float =
                Math.sin(
                    elapsed / 900 +
                    index * 0.85
                ) *
                3 *
                scale;

            const appear =
                clamp(
                    progress * 1.5 -
                    index * 0.04
                );

            ctx.globalAlpha =
                appear * 0.48;

            ctx.fillStyle =
                "#c987a5";

            ctx.font =
                `${heart.size * scale}px Arial`;

            ctx.textAlign =
                "center";

            ctx.fillText(
                "♡",

                cx +
                heart.x * scale,

                cy +
                heart.y * scale +
                float
            );
        }
    );

    ctx.restore();
}


/* =========================================================
   TEXTO FINAL
========================================================= */

function drawFinalText(
    cx,
    cy,
    scale,
    progress
) {

    if (progress <= 0) return;

    const p =
        easeOutQuart(progress);

    ctx.save();

    ctx.globalAlpha =
        p * 0.70;

    ctx.fillStyle =
        "#8f5b72";

    ctx.font =
        `${10 * scale}px Arial`;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        "Clique em qualquer lugar para fechar",

        cx,

        cy +
        315 * scale
    );

    ctx.restore();
}


/* =========================================================
   DESENHO COMPLETO
========================================================= */

function drawFlor(timestamp) {

    const w =
        canvas.width;

    const h =
        canvas.height;

    const cx =
        w / 2;

    const cy =
        h / 2;

    const scale =
        Math.min(w, h) /
        CONFIG.scaleBase;

    const elapsed =
        timestamp -
        animationStart;


    /* =====================================================
       IMPORTANTE:
       limpa somente o desenho anterior.
       NÃO coloca fundo.
    ===================================================== */

    clearCanvas();


    /* =====================================================
       SOMBRA
    ===================================================== */

    const shadowProgress =
        clamp(elapsed / 1800);

    drawFlowerShadow(
        cx,
        cy,
        scale,
        shadowProgress
    );


    /* =====================================================
       CAULE
    ===================================================== */

    const stemProgress =
        clamp(
            elapsed /
            CONFIG.animation.stem
        );

    drawStem(
        cx,
        cy,
        scale,
        stemProgress
    );


    /* =====================================================
       FOLHAS
    ===================================================== */

    const leaf1 =
        clamp(
            (elapsed - 500) /
            650
        );

    const leaf2 =
        clamp(
            (elapsed - 800) /
            650
        );

    const leaf3 =
        clamp(
            (elapsed - 1050) /
            650
        );


    drawLeaf(
        cx - 18 * scale,
        cy + 138 * scale, -2.65,
        65 * scale,
        28 * scale,
        leaf1,
        scale
    );


    drawLeaf(
        cx + 5 * scale,
        cy + 90 * scale, -0.40,
        59 * scale,
        25 * scale,
        leaf2,
        scale
    );


    drawLeaf(
        cx - 4 * scale,
        cy + 185 * scale,
        2.75,
        48 * scale,
        22 * scale,
        leaf3,
        scale
    );


    /* =====================================================
       ROSA
    ===================================================== */

    const flowerX =
        cx;

    const flowerY =
        cy;


    roseLayers.forEach(
        (layer, layerIndex) => {

            const layerProgress =
                clamp(
                    (elapsed - layer.start) /
                    layer.duration
                );

            if (
                layerProgress <= 0
            ) {
                return;
            }


            for (
                let i = 0; i < layer.count; i++
            ) {

                const baseAngle =
                    layer.rotation +
                    (
                        i /
                        layer.count
                    ) *
                    Math.PI *
                    2;


                const irregular =
                    Math.sin(
                        i * 9.17 +
                        layerIndex * 4.23
                    ) *
                    0.045;


                const angle =
                    baseAngle +
                    irregular;


                const lengthVariation =
                    0.92 +
                    (
                        (
                            i * 17 +
                            layerIndex * 11
                        ) % 10
                    ) /
                    100;


                const widthVariation =
                    0.94 +
                    (
                        (
                            i * 13 +
                            layerIndex * 7
                        ) % 8
                    ) /
                    100;


                const length =
                    layer.length *
                    scale *
                    lengthVariation;


                const width =
                    layer.width *
                    scale *
                    widthVariation;


                drawRosePetal(
                    flowerX,
                    flowerY,
                    angle,
                    length,
                    width,
                    layerProgress,
                    layer.palette,
                    scale,
                    layerIndex,
                    i
                );
            }
        }
    );


    /* =====================================================
       PÉTALAS INTERNAS
    ===================================================== */

    const innerProgress =
        clamp(
            (elapsed - 1850) /
            900
        );


    for (
        let i = 0; i < 5; i++
    ) {

        drawInnerCurl(
            flowerX,
            flowerY,
            scale,
            innerProgress,
            i
        );
    }


    /* =====================================================
       CENTRO
    ===================================================== */

    const centerProgress =
        clamp(
            (elapsed - 2350) /
            700
        );


    drawRoseCenter(
        flowerX,
        flowerY,
        scale,
        centerProgress
    );


    /* =====================================================
       CORAÇÕES
    ===================================================== */

    const heartsProgress =
        clamp(
            (elapsed - 3150) /
            1100
        );


    drawHearts(
        cx,
        cy,
        scale,
        heartsProgress,
        elapsed
    );


    /* =====================================================
       TEXTO
    ===================================================== */

    const textProgress =
        clamp(
            (elapsed - 3500) /
            800
        );


    drawFinalText(
        cx,
        cy,
        scale,
        textProgress
    );
}


/* =========================================================
   ANIMAÇÃO
========================================================= */

function animate(timestamp) {

    if (!animationStart) {

        animationStart =
            timestamp;
    }

    drawFlor(timestamp);

    requestAnimationFrame(
        animate
    );
}


/* =========================================================
   CLIQUE
========================================================= */

canvas.addEventListener(
    "click",
    () => {

        animationStart =
            performance.now();
    }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

window.addEventListener(
    "resize",
    resizeCanvas
);


document.addEventListener(
    "DOMContentLoaded",
    () => {

        resizeCanvas();

        requestAnimationFrame(
            animate
        );
    }
);