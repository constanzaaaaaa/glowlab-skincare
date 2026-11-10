// Datos de demostración para la evaluación 2 (basados en el Flask original).
// NO utilizar estas credenciales de prueba en un sistema real.
export const ROLES = [{ id: 1, nombre: "Administrador" }, { id: 2, nombre: "Vendedor" }, { id: 3, nombre: "Cliente" }];
export const CATEGORIAS = ["Limpiadores", "Sueros", "Hidratantes", "Protector Solar", "Exfoliantes", "Mascarillas", "Contorno de Ojos"].map((nombre, i) => ({ id: i + 1, nombre }));
export const REGIONES = ["Región Metropolitana", "Valparaíso", "Biobío"].map((nombre, i) => ({ id: i + 1, nombre }));
export const COMUNAS = [{ id: 1, regionId: 1, nombre: "Santiago" }, { id: 2, regionId: 1, nombre: "Providencia" }, { id: 3, regionId: 1, nombre: "Maipú" }, { id: 4, regionId: 2, nombre: "Valparaíso" }, { id: 5, regionId: 2, nombre: "Viña del Mar" }, { id: 6, regionId: 3, nombre: "Concepción" }, { id: 7, regionId: 3, nombre: "Talcahuano" }];

export const PRODUCTOS = [
  ["GL-001", "Hydra Glow Serum", "Sérum concentrado en ácido hialurónico para hidratar la piel.", 15990, 18, 4, 2, "productos/hidratante1.webp"],
  ["GL-002", "Pure Clay Cleanser", "Limpiador facial con arcilla blanca que remueve impurezas.", 9990, 25, 5, 1, "productos/limpiador1.jpg"],
  ["GL-003", "Velvet Repair Cream", "Crema reparadora para restaurar la barrera cutánea.", 18990, 14, 3, 3, "productos/crema.webp"],
  ["GL-004", "Sun Shield SPF50", "Protector solar facial de amplio espectro.", 13990, 20, 5, 4, "productos/bloqueador1.jpg"],
  ["GL-005", "Gentle Glow Scrub", "Exfoliante suave que renueva la piel.", 11990, 16, 4, 5, "productos/exfoliante1.jpg"],
  ["GL-006", "Rose Clay Mask", "Mascarilla purificante de arcilla rosada.", 12990, 12, 3, 6, "productos/mascarilla.jfif"],
  ["GL-007", "Bright Eye Contour", "Contorno de ojos con cafeína y vitamina E.", 14990, 3, 4, 7, "productos/contorno1.webp"],
  ["GL-008", "Vitamin C Radiance Serum", "Sérum antioxidante con vitamina C.", 16990, 9, 3, 2, "productos/suero1.webp"]
].map(([codigo, nombre, descripcion, precio, stock, stockCritico, categoriaId, imagen]) =>
  ({
    codigo, nombre, descripcion, precio, stock, stockCritico, categoriaId, imagen, estado: "Activo",
    // Promociones de ejemplo para la demo: pueden modificarse desde Administración.
    ofertaTipo: codigo === "GL-002" ? "2x1" : codigo === "GL-008" ? "porcentaje" : "ninguna",
    descuentoPorcentaje: codigo === "GL-008" ? 20 : 0
  })
);

export const USUARIOS = [
  ["123456785", "Admin", "Glowlab", "admin@gmail.com", "64b0a321b02670fea07b462dd501b4ddbf6e5c6ee267b6bb2c215db99c83eb05", 1, 1, 1, "Av. Principal 123"],
  ["987654325", "Vendedor", "Glowlab", "vendedor@gmail.com", "ab4b6e5e2773dec4102756cdd2b682fb937e1537c07f3cf7d768411b0b75a638", 2, 1, 2, "Calle Venta 456"],
  ["112223339", "Camila", "Soto Perez", "camila@gmail.com", "2f35efddce00511b6e1ba5b4875601fbebd0616002c8b3382c704f7de2ebc13c", 3, 2, 4, "Los Aromos 789"],
  ["201113334", "Diego", "Fernandez Rojas", "diego@duocuc.cl", "d663f952a85991ff6c9540be310147f829e798ede49131cd0c5ef847d171d310", 3, 3, 6, "Las Rosas 321"]
].map(([run, nombre, apellidos, correo, claveHash, rolId, regionId, comunaId, direccion]) =>
  ({ run, nombre, apellidos, correo, claveHash, fechaNacimiento: "", rolId, regionId, comunaId, direccion, estado: "Activo" })
);

export const NOTICIAS = [
  {
    id: 1, titulo: "GLOWLAB abre sus puertas",
    resumen: "Conoce el propósito de GlowLab y cómo queremos acompañarte a construir una rutina de cuidado facial sencilla, informada y constante.",
    imagen: "blog/apertura.jpeg", fecha: "2026-08-01", categoria: "Conoce GlowLab", lecturaMinutos: 4,
    secciones: [
      { titulo: "Una tienda pensada para tu rutina", parrafos: [
        "GlowLab nace como una propuesta de tienda online enfocada en el cuidado facial. La idea es reunir distintas categorías de productos en un mismo espacio para que puedas explorar alternativas, comparar sus características y encontrar opciones que se ajusten a lo que buscas.",
        "Creemos que una rutina no tiene que ser complicada para ser significativa. Conocer los productos, entender para qué se utilizan y elegirlos con calma es un buen punto de partida."
      ]},
      { titulo: "Qué puedes encontrar en GlowLab", parrafos: [
        "El catálogo reúne productos de limpieza, sueros, hidratación, protección solar, exfoliación, mascarillas y cuidado del contorno de ojos. Cada categoría cumple un papel distinto dentro de una rutina y puede incorporarse según las necesidades y preferencias de cada persona."
      ], puntos: [
        "Limpiadores para retirar residuos e impurezas de la piel.",
        "Sueros para complementar la rutina con fórmulas específicas.",
        "Cremas hidratantes para aportar confort y ayudar a mantener la piel hidratada.",
        "Protectores solares para incorporar protección durante el día.",
        "Mascarillas y exfoliantes como complementos ocasionales, según tolerancia."
      ]},
      { titulo: "Una experiencia de compra clara", parrafos: [
        "Queremos que puedas revisar la descripción de cada producto antes de agregarlo al carrito. En tu cuenta también puedes consultar el historial de compras registradas en la tienda de demostración.",
        "Las ofertas, cuando están disponibles, se identifican en el catálogo y en el detalle del producto para que puedas revisar sus condiciones antes de comprar."
      ]}
    ],
    consejos: [
      "Identifica primero qué buscas: limpieza, hidratación, protección o un cuidado complementario.",
      "Lee la descripción y las indicaciones del envase antes de incorporar un producto.",
      "Introduce los productos nuevos de manera gradual para observar cómo responde tu piel."
    ],
    conclusion: "GlowLab quiere acompañarte con un catálogo ordenado e información útil para que cada elección sea más consciente. Explora, compara y construye una rutina que puedas mantener."
  },
  {
    id: 2, titulo: "Las tendencias skincare más esperadas del año",
    resumen: "Más allá de las modas, descubre por qué las rutinas simples, la hidratación y la protección solar siguen siendo buenos pilares del cuidado facial.",
    imagen: "blog/tendencia.jpeg", fecha: "2026-08-10", categoria: "Rutinas y consejos", lecturaMinutos: 5,
    secciones: [
      { titulo: "Menos pasos, más constancia", parrafos: [
        "Una rutina extensa no es necesariamente mejor. Para muchas personas, comenzar con limpieza, hidratación y protección solar durante el día resulta más fácil de mantener que sumar numerosos productos desde el primer momento.",
        "La constancia permite conocer cómo responde la piel y distinguir qué productos aportan valor a la rutina. Si quieres incorporar un suero, una mascarilla o un exfoliante, puedes hacerlo progresivamente."
      ]},
      { titulo: "La barrera cutánea merece atención", parrafos: [
        "La barrera cutánea ayuda a mantener la hidratación y protege la superficie de la piel frente a factores externos. Una rutina demasiado agresiva o con demasiados exfoliantes puede generar incomodidad en algunas personas.",
        "Por eso, conviene priorizar una limpieza suave, hidratación adecuada y evitar combinar muchos productos nuevos al mismo tiempo. Si aparece irritación persistente, suspende el producto y consulta con un profesional de salud."
      ]},
      { titulo: "Protección solar como hábito diario", parrafos: [
        "La protección solar no es solo un paso para los días de playa. Incorporar un protector adecuado a la rutina diaria ayuda a proteger la piel de la exposición a la radiación ultravioleta.",
        "Sigue las indicaciones del envase, aplica una cantidad suficiente y reaplica según las instrucciones del producto y las condiciones de exposición."
      ]},
      { titulo: "Cómo elegir productos sin dejarte llevar por la moda", parrafos: [
        "Un ingrediente popular no necesariamente es el más adecuado para todas las personas. Revisa la finalidad del producto, sus ingredientes declarados, las instrucciones de uso y si se adapta a tu tipo de piel y a los productos que ya utilizas."
      ], puntos: [
        "Evita introducir varios activos nuevos en una misma semana.",
        "Haz una prueba en una zona pequeña cuando corresponda y sigue las indicaciones del fabricante.",
        "No confundas una rutina popular con una recomendación personalizada."
      ]}
    ],
    consejos: [
      "Mantén una rutina básica que puedas repetir cada día.",
      "Incorpora un producto nuevo a la vez y observa la tolerancia.",
      "Prioriza la protección solar durante el día y respeta las instrucciones de uso."
    ],
    conclusion: "La mejor rutina es la que responde a tus necesidades, respeta la tolerancia de tu piel y puedes mantener en el tiempo. Las tendencias pueden inspirar, pero la información y la constancia deben guiar tus decisiones."
  },
  {
    id: 3, titulo: "5 curiosidades sobre el cuidado de la piel",
    resumen: "Pequeños hábitos pueden hacer más ordenada tu rutina: conoce cinco datos prácticos para cuidar tu piel con mayor atención.",
    imagen: "blog/curiosidades.jpeg", fecha: "2026-08-20", categoria: "Consejos de cuidado", lecturaMinutos: 4,
    secciones: [
      { titulo: "1. La piel puede cambiar con el tiempo", parrafos: [
        "La sensación de sequedad, brillo o sensibilidad puede variar por factores como el clima, la edad, los hábitos y el entorno. Por eso, una rutina que te funcionaba antes puede necesitar ajustes."
      ]},
      { titulo: "2. La limpieza debe ser adecuada, no agresiva", parrafos: [
        "Limpiar el rostro ayuda a retirar suciedad, sudor, residuos y protector solar. Sin embargo, frotar con fuerza o utilizar productos que dejan la piel incómoda no significa que la limpieza haya sido más efectiva."
      ]},
      { titulo: "3. Los productos nuevos necesitan observación", parrafos: [
        "Cuando incorporas un producto, conviene revisar sus instrucciones y probarlo de forma gradual. Una prueba localizada puede ayudar a detectar una reacción antes de aplicarlo en una zona extensa, aunque no garantiza que nunca aparezca irritación."
      ]},
      { titulo: "4. El protector solar también importa en la rutina cotidiana", parrafos: [
        "La exposición solar ocurre durante actividades habituales, no solamente en vacaciones. Utiliza un protector adecuado y sigue las recomendaciones de aplicación y reaplicación indicadas por el fabricante."
      ]},
      { titulo: "5. No todos los productos se utilizan de la misma manera", parrafos: [
        "Un limpiador se enjuaga, un suero suele aplicarse antes de la crema y una mascarilla puede tener un tiempo de uso específico. Leer las instrucciones evita utilizar un producto fuera de la forma recomendada."
      ]}
    ],
    consejos: [
      "Lávate las manos antes de aplicar productos faciales.",
      "Respeta la frecuencia de uso indicada para exfoliantes y mascarillas.",
      "Si notas ardor, enrojecimiento o irritación, suspende el producto y revisa sus indicaciones."
    ],
    conclusion: "Cuidar la piel también consiste en observarla, respetar sus tiempos y elegir productos con información clara. No necesitas utilizar todo: una rutina sencilla y adecuada puede ser un buen comienzo."
  }
];
