// Información editorial complementaria para los productos del catálogo.
// Solo se nombran ingredientes que aparecen en las descripciones originales del proyecto.
const FICHAS = {
  "GL-001": {
    enfoque: "Sérum hidratante con ácido hialurónico",
    descripcionAmpliada: "Hydra Glow Serum está pensado para complementar la rutina de hidratación. Su descripción destaca el ácido hialurónico, un ingrediente utilizado en cosmética por su capacidad de ayudar a atraer y retener agua en la superficie de la piel.",
    ingrediente: "Ácido hialurónico",
    tipoPiel: "Puede ser una alternativa para rutinas que buscan aportar hidratación. Ajusta su uso según la respuesta y tolerancia de tu piel.",
    beneficios: ["Complementa los pasos de hidratación.", "Aporta una textura ligera a la rutina.", "Puede combinarse con una crema hidratante para completar el cuidado."],
    modoUso: ["Limpia el rostro y seca suavemente.", "Aplica una pequeña cantidad sobre la piel según las indicaciones del envase.", "Continúa con tu crema hidratante; durante el día, finaliza con protector solar."],
    recomendaciones: ["No necesitas aplicar una cantidad excesiva.", "Si es tu primera vez con el producto, incorpóralo gradualmente."]
  },
  "GL-002": {
    enfoque: "Limpieza facial con arcilla blanca",
    descripcionAmpliada: "Pure Clay Cleanser es un limpiador facial cuya descripción destaca la arcilla blanca y su función para remover impurezas. Está pensado para formar parte del primer paso de una rutina de cuidado.",
    ingrediente: "Arcilla blanca",
    tipoPiel: "Puede interesar especialmente a quienes buscan una limpieza para piel mixta o con tendencia al brillo. La tolerancia individual y las instrucciones del envase deben guiar su uso.",
    beneficios: ["Ayuda a retirar residuos e impurezas.", "Prepara la piel para los siguientes pasos de la rutina.", "Permite mantener un paso de limpieza sencillo."],
    modoUso: ["Humedece el rostro con agua.", "Aplica el limpiador y masajea suavemente evitando el contorno de ojos.", "Enjuaga completamente y seca sin frotar."],
    recomendaciones: ["Evita el agua demasiado caliente y la fricción intensa.", "Si deja sensación de tirantez o irritación, reduce su uso o suspéndelo."]
  },
  "GL-003": {
    enfoque: "Crema reparadora e hidratante",
    descripcionAmpliada: "Velvet Repair Cream está descrita como una crema reparadora orientada a ayudar a restaurar la barrera cutánea. Puede integrarse como paso de hidratación y confort dentro de una rutina facial.",
    ingrediente: "La ficha original no especifica ingredientes activos adicionales.",
    tipoPiel: "Puede resultar de interés para personas que buscan una crema de hidratación y confort, especialmente cuando sienten la piel seca o tirante. Revisa la fórmula completa para confirmar que se adapte a ti.",
    beneficios: ["Complementa la hidratación diaria.", "Ayuda a aportar confort a la piel.", "Puede utilizarse después de los pasos de limpieza y suero."],
    modoUso: ["Aplica sobre la piel limpia, después de los productos de textura más ligera.", "Distribuye una cantidad adecuada con movimientos suaves.", "Sigue la frecuencia indicada por el fabricante."],
    recomendaciones: ["Revisa la lista completa de ingredientes antes de usarla.", "Si tu piel es sensible, prueba primero en una zona pequeña."]
  },
  "GL-004": {
    enfoque: "Protector solar facial SPF50",
    descripcionAmpliada: "Sun Shield SPF50 es un protector solar facial de amplio espectro. Está pensado para ser parte del cuidado diurno y complementar los hábitos de protección frente a la exposición solar.",
    ingrediente: "La ficha original no especifica filtros ni ingredientes adicionales.",
    tipoPiel: "La elección también depende de la textura y acabado que prefieras. Revisa el envase y selecciona una fórmula que puedas aplicar en la cantidad recomendada.",
    beneficios: ["Incorpora protección solar de factor SPF50.", "Complementa la rutina facial durante el día.", "Puede utilizarse como último paso de la rutina de mañana, según las indicaciones del envase."],
    modoUso: ["Aplica generosamente antes de la exposición solar, siguiendo las instrucciones del producto.", "Cubre de manera uniforme las zonas expuestas.", "Reaplica con la frecuencia indicada, especialmente después de sudar, nadar o secarte con una toalla."],
    recomendaciones: ["No reduzcas la cantidad para que el producto dure más: una aplicación insuficiente puede disminuir la protección.", "Complementa el uso con sombra, ropa y otros hábitos de protección."]
  },
  "GL-005": {
    enfoque: "Exfoliación facial suave",
    descripcionAmpliada: "Gentle Glow Scrub es un exfoliante descrito como suave, pensado para complementar la limpieza mediante una renovación superficial. La exfoliación no necesita realizarse todos los días y debe adaptarse a la tolerancia de la piel.",
    ingrediente: "La ficha original no especifica partículas ni ingredientes exfoliantes.",
    tipoPiel: "Está dirigido a quienes buscan incorporar exfoliación y cuya piel tolera este tipo de producto. No es una buena opción para utilizar sobre piel irritada o lesionada.",
    beneficios: ["Complementa ocasionalmente la rutina de limpieza.", "Ayuda a retirar células superficiales mediante exfoliación.", "Puede dejar una sensación de piel más lisa, según la tolerancia individual."],
    modoUso: ["Sigue la frecuencia y el tiempo indicados en el envase.", "Aplica con movimientos suaves, sin presionar ni frotar con fuerza.", "Enjuaga completamente y continúa con hidratación."],
    recomendaciones: ["Evita combinarlo el mismo día con otros exfoliantes si no sabes cómo responde tu piel.", "Suspende su uso si provoca ardor, enrojecimiento o irritación."]
  },
  "GL-006": {
    enfoque: "Mascarilla facial de arcilla rosada",
    descripcionAmpliada: "Rose Clay Mask es una mascarilla purificante cuya descripción destaca la arcilla rosada. Se plantea como un paso complementario y ocasional, no como sustituto de la limpieza o hidratación diaria.",
    ingrediente: "Arcilla rosada",
    tipoPiel: "Puede interesar a quienes buscan una mascarilla purificante. Si tu piel es seca o sensible, revisa cuidadosamente las indicaciones y observa su tolerancia.",
    beneficios: ["Aporta un paso complementario a la rutina.", "Permite dedicar un momento ocasional al cuidado facial.", "Puede ayudar a retirar residuos superficiales según la fórmula."],
    modoUso: ["Aplica siguiendo las instrucciones del fabricante y evitando ojos y labios.", "Respeta el tiempo indicado; no es necesario dejarla más tiempo del recomendado.", "Retira como indica el envase y aplica hidratante."],
    recomendaciones: ["No la utilices sobre piel irritada o con heridas.", "Ajusta la frecuencia según las indicaciones y la respuesta de tu piel."]
  },
  "GL-007": {
    enfoque: "Cuidado del contorno de ojos",
    descripcionAmpliada: "Bright Eye Contour es un producto para la zona del contorno de ojos. Su descripción menciona cafeína y vitamina E como parte de su propuesta de cuidado.",
    ingrediente: "Cafeína y vitamina E",
    tipoPiel: "Diseñado para la zona del contorno de ojos. La tolerancia puede variar; revisa la fórmula y evita el contacto directo con los ojos.",
    beneficios: ["Complementa el cuidado de la zona del contorno de ojos.", "Incorpora cafeína y vitamina E, según la descripción del producto.", "Se integra en pequeñas cantidades dentro de la rutina facial."],
    modoUso: ["Aplica una cantidad pequeña sobre la piel limpia, siguiendo el envase.", "Distribuye con suaves toques, sin arrastrar ni frotar.", "Evita la línea de las pestañas y el contacto directo con los ojos."],
    recomendaciones: ["No lo apliques dentro del ojo ni sobre piel irritada.", "Si aparece molestia, suspende su uso y enjuaga con abundante agua."]
  },
  "GL-008": {
    enfoque: "Sérum antioxidante con vitamina C",
    descripcionAmpliada: "Vitamin C Radiance Serum es un sérum antioxidante cuya descripción destaca la vitamina C. Puede complementar una rutina orientada al cuidado y luminosidad de la piel, siempre respetando la tolerancia individual.",
    ingrediente: "Vitamina C",
    tipoPiel: "Puede incorporarse a distintas rutinas si la fórmula es adecuada para tu piel. Si tienes sensibilidad o nunca has utilizado vitamina C, comienza de forma gradual y revisa las instrucciones.",
    beneficios: ["Incorpora vitamina C a la rutina facial.", "Complementa los pasos de cuidado antioxidante.", "Puede combinarse con hidratación y protección solar durante el día."],
    modoUso: ["Limpia y seca suavemente el rostro.", "Aplica la cantidad indicada en el envase, evitando el contacto con los ojos.", "Continúa con hidratante y utiliza protector solar durante el día."],
    recomendaciones: ["Introduce el producto gradualmente para observar la tolerancia.", "Guárdalo según las indicaciones del fabricante y revisa su aspecto y fecha de uso."]
  }
};

const GUIAS_CATEGORIA = {
  1: { tipoPiel: "Elige el limpiador según la sensación que deja en tu piel y las indicaciones de su fórmula.", modoUso: ["Utiliza sobre el rostro según las instrucciones del envase.", "Enjuaga si corresponde y seca suavemente.", "Continúa con hidratación."] },
  2: { tipoPiel: "Los sueros pueden responder a objetivos distintos. Revisa sus ingredientes y elige una fórmula compatible con tu rutina.", modoUso: ["Aplica después de la limpieza.", "Utiliza la cantidad y frecuencia indicadas.", "Continúa con crema hidratante."] },
  3: { tipoPiel: "Escoge la textura y fórmula que se sientan cómodas para tu piel.", modoUso: ["Aplica sobre la piel limpia.", "Distribuye suavemente por rostro y cuello si el envase lo indica.", "Úsala con la frecuencia recomendada."] },
  4: { tipoPiel: "Elige una textura que puedas aplicar en cantidad suficiente y que se adapte a tu rutina.", modoUso: ["Aplica antes de la exposición solar.", "Cubre las zonas expuestas y reaplica según el envase.", "Complementa con otras medidas de protección."] },
  5: { tipoPiel: "La exfoliación debe adaptarse a la tolerancia de la piel; evita usarla sobre piel irritada.", modoUso: ["Respeta la frecuencia indicada.", "No frotes con fuerza.", "Enjuaga si corresponde y aplica hidratante."] },
  6: { tipoPiel: "Revisa si la fórmula se adapta a tu piel y evita utilizar mascarillas sobre zonas irritadas.", modoUso: ["Aplica siguiendo el tiempo indicado.", "Retira según las instrucciones.", "Finaliza con hidratación."] },
  7: { tipoPiel: "Utiliza productos formulados para el contorno de ojos y revisa sus indicaciones.", modoUso: ["Aplica una cantidad pequeña.", "Distribuye con suaves toques.", "Evita el contacto directo con los ojos."] }
};

export function obtenerContenidoProducto(producto) {
  if (FICHAS[producto?.codigo]) return FICHAS[producto.codigo];
  const guia = GUIAS_CATEGORIA[Number(producto?.categoriaId)] || {};
  return {
    enfoque: producto?.nombre || "Producto de cuidado facial",
    descripcionAmpliada: producto?.descripcion || "Consulta la descripción y el envase para conocer las características específicas de este producto.",
    ingrediente: "Consulta la lista de ingredientes del envase.",
    tipoPiel: guia.tipoPiel || "Revisa la fórmula y las indicaciones del fabricante para elegir según las necesidades de tu piel.",
    beneficios: ["Complementa tu rutina de cuidado personal.", "Revisa las características específicas indicadas por el fabricante."],
    modoUso: guia.modoUso || ["Sigue las instrucciones del envase.", "Utiliza la cantidad y frecuencia recomendadas."],
    recomendaciones: ["Revisa la lista de ingredientes antes de usar.", "Suspende su uso si aparece irritación o molestia."]
  };
}
