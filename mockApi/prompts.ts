/* eslint-disable @typescript-eslint/prefer-as-const */
export const examplePrompt1 = JSON.stringify({
  prompt: {
    last_node_id: 14,
    last_link_id: 10,
    nodes: [
      {
        id: 8,
        type: 'VAEDecode',
        pos: [1305.6273329118997, 589.0916554837115],
        size: {
          '0': 320,
          '1': 50,
        },
        flags: {},
        order: 5,
        mode: 0,
        inputs: [
          {
            link: 8,
            name: 'samples',
            type: 'LATENT',
          },
          {
            link: 9,
            name: 'vae',
            type: 'VAE',
          },
        ],
        outputs: [
          {
            links: [7],
            name: 'IMAGE',
            shape: 3,
            slot_index: 0,
            type: 'IMAGE',
          },
        ],
        properties: {
          'Node name for S&R': 'VAEDecode',
        },
      },
      {
        id: 3,
        type: 'KSamplerAdvanced //Inspire',
        pos: [1405.6273329118997, 678.1783177358948],
        size: {
          '0': 320,
          '1': 450,
        },
        flags: {},
        order: 4,
        mode: 0,
        inputs: [
          {
            link: 5,
            name: 'model',
            type: 'MODEL',
          },
          {
            link: 3,
            name: 'positive',
            type: 'CONDITIONING',
          },
          {
            link: 4,
            name: 'negative',
            type: 'CONDITIONING',
          },
          {
            link: 2,
            name: 'latent_image',
            type: 'LATENT',
          },
          {
            link: null,
            name: 'noise_opt',
            type: 'NOISE',
          },
        ],
        outputs: [
          {
            links: [8],
            name: 'LATENT',
            shape: 3,
            slot_index: 0,
            type: 'LATENT',
          },
        ],
        properties: {
          'Node name for S&R': 'KSamplerAdvanced //Inspire',
        },
        widgets_values: [
          true,
          1017770969198960,
          'randomize',
          43,
          6,
          'dpmpp_3m_sde_gpu',
          'exponential',
          0,
          10000,
          'GPU(=A1111)',
          false,
          'comfy',
          0,
          0,
        ],
      },
      {
        id: 2,
        type: 'SDXL Empty Latent Image (rgthree)',
        pos: [671.4085829118969, 746.8729054837113],
        size: {
          '0': 670,
          '1': 150,
        },
        flags: {},
        order: 0,
        mode: 0,
        outputs: [
          {
            links: [2],
            name: 'LATENT',
            shape: 3,
            slot_index: 0,
            type: 'LATENT',
          },
          {
            links: null,
            name: 'CLIP_WIDTH',
            shape: 3,
            type: 'INT',
          },
          {
            links: null,
            name: 'CLIP_HEIGHT',
            shape: 3,
            type: 'INT',
          },
        ],
        properties: {
          'Node name for S&R': 'SDXL Empty Latent Image (rgthree)',
        },
        widgets_values: [' 896 x 1152  (portrait xD)', 2, 1],
      },
      {
        id: 1,
        type: 'CheckpointLoaderSimple',
        pos: [661.4085829118969, 586.8729054837115],
        size: {
          '0': 670,
          '1': 100,
        },
        flags: {},
        order: 1,
        mode: 0,
        outputs: [
          {
            links: [5],
            name: 'MODEL',
            shape: 3,
            slot_index: 0,
            type: 'MODEL',
          },
          {
            links: [1, 10],
            name: 'CLIP',
            shape: 3,
            slot_index: 1,
            type: 'CLIP',
          },
          {
            links: [9],
            name: 'VAE',
            shape: 3,
            slot_index: 2,
            type: 'VAE',
          },
        ],
        properties: {
          'Node name for S&R': 'CheckpointLoaderSimple',
        },
        widgets_values: ['NewRealityXL1 ❗ All-In-One Photographic/newrealityxlAllInOne_21.safetensors'],
      },
      {
        id: 7,
        type: 'CLIPTextEncode',
        pos: [2265.408582911897, 1214.8729054837136],
        size: {
          '0': 490,
          '1': 270,
        },
        flags: {},
        order: 3,
        mode: 0,
        inputs: [
          {
            link: 10,
            name: 'clip',
            type: 'CLIP',
          },
        ],
        outputs: [
          {
            links: [4],
            name: 'CONDITIONING',
            shape: 3,
            slot_index: 0,
            type: 'CONDITIONING',
          },
        ],
        properties: {
          'Node name for S&R': 'CLIPTextEncode',
        },
        widgets_values: [
          '(high contrast, over saturated, glossy:1.1), (cartoon, 3d, 3d render, Photoshop, sketch, sketches, video game, draw, paint, painting, render, cgi, computer graphics, anime, manga, 2d art, 3d art, illustration:1.1), (canvas frame, watermark, signature, username, artist name:1.1),lowres, error, cropped, worst quality, low quality, jpeg artifacts, out of frame, watermark, signature, , deformed, ugly, mutilated, disfigured, text, extra limbs, face cut, head cut, extra fingers, extra arms, poorly drawn face, mutation, bad proportions, cropped head, malformed limbs, mutated hands, fused fingers, long neck, lowres, error, cropped, worst quality, low quality, jpeg artifacts, out of frame, watermark, signature, illustration, painting, drawing, art, sketch',
        ],
        color: '#322',
        bgcolor: '#533',
      },
      {
        id: 6,
        type: 'CLIPTextEncode',
        pos: [1708, 1291],
        size: {
          '0': 490,
          '1': 270,
        },
        flags: {},
        order: 2,
        mode: 0,
        inputs: [
          {
            link: 1,
            name: 'clip',
            type: 'CLIP',
          },
        ],
        outputs: [
          {
            links: [3],
            name: 'CONDITIONING',
            shape: 3,
            slot_index: 0,
            type: 'CONDITIONING',
          },
        ],
        properties: {
          'Node name for S&R': 'CLIPTextEncode',
        },
        widgets_values: [
          'A detailed chalk pastel of a dog wearing Trump clothes on the streets of cyberpunk toyko japan, high res, natural lighting, fun atmosphere, grunge',
        ],
        color: '#232',
        bgcolor: '#353',
      },
      {
        id: 10,
        type: 'SaveImage',
        pos: [1760, 570],
        size: {
          '0': 1000,
          '1': 580,
        },
        flags: {},
        order: 6,
        mode: 0,
        inputs: [
          {
            link: 7,
            name: 'images',
            type: 'IMAGE',
          },
        ],
        properties: {},
        widgets_values: ['image'],
      },
    ],
    links: [
      [1, 1, 1, 6, 0, 'CLIP'],
      [2, 2, 0, 3, 3, 'LATENT'],
      [3, 6, 0, 3, 1, 'CONDITIONING'],
      [4, 7, 0, 3, 2, 'CONDITIONING'],
      [5, 1, 0, 3, 0, 'MODEL'],
      [7, 8, 0, 10, 0, 'IMAGE'],
      [8, 3, 0, 8, 0, 'LATENT'],
      [9, 1, 2, 8, 1, 'VAE'],
      [10, 1, 1, 7, 0, 'CLIP'],
    ],
    groups: [],
    config: {},
    extra: {
      '0246.VERSION': [0, 0, 4],
    },
    version: 0.4,
  },
});


export const examplePrompt2 = JSON.stringify({
  prompt: {
    last_node_id: 14,
    last_link_id: 10,
    nodes: [
      {
        id: 8,
        type: 'VAEDecode',
        pos: [1305.6273329118997, 589.0916554837115],
        size: {
          '0': 320,
          '1': 50,
        },
        flags: {},
        order: 5,
        mode: 0,
        inputs: [
          {
            link: 8,
            name: 'samples',
            type: 'LATENT',
          },
          {
            link: 9,
            name: 'vae',
            type: 'VAE',
          },
        ],
        outputs: [
          {
            links: [7],
            name: 'IMAGE',
            shape: 3,
            slot_index: 0,
            type: 'IMAGE',
          },
        ],
        properties: {
          'Node name for S&R': 'VAEDecode',
        },
      },
      {
        id: 3,
        type: 'KSamplerAdvanced //Inspire',
        pos: [1405.6273329118997, 678.1783177358948],
        size: {
          '0': 320,
          '1': 450,
        },
        flags: {},
        order: 4,
        mode: 0,
        inputs: [
          {
            link: 5,
            name: 'model',
            type: 'MODEL',
          },
          {
            link: 3,
            name: 'positive',
            type: 'CONDITIONING',
          },
          {
            link: 4,
            name: 'negative',
            type: 'CONDITIONING',
          },
          {
            link: 2,
            name: 'latent_image',
            type: 'LATENT',
          },
          {
            link: null,
            name: 'noise_opt',
            type: 'NOISE',
          },
        ],
        outputs: [
          {
            links: [8],
            name: 'LATENT',
            shape: 3,
            slot_index: 0,
            type: 'LATENT',
          },
        ],
        properties: {
          'Node name for S&R': 'KSamplerAdvanced //Inspire',
        },
        widgets_values: [
          true,
          1017770969198960,
          'randomize',
          43,
          6,
          'dpmpp_3m_sde_gpu',
          'exponential',
          0,
          10000,
          'GPU(=A1111)',
          false,
          'comfy',
          0,
          0,
        ],
      },
      {
        id: 2,
        type: 'SDXL Empty Latent Image (rgthree)',
        pos: [671.4085829118969, 746.8729054837113],
        size: {
          '0': 670,
          '1': 150,
        },
        flags: {},
        order: 0,
        mode: 0,
        outputs: [
          {
            links: [2],
            name: 'LATENT',
            shape: 3,
            slot_index: 0,
            type: 'LATENT',
          },
          {
            links: null,
            name: 'CLIP_WIDTH',
            shape: 3,
            type: 'INT',
          },
          {
            links: null,
            name: 'CLIP_HEIGHT',
            shape: 3,
            type: 'INT',
          },
        ],
        properties: {
          'Node name for S&R': 'SDXL Empty Latent Image (rgthree)',
        },
        widgets_values: [' 896 x 1152  (portrait xD)', 2, 1],
      },
      {
        id: 1,
        type: 'CheckpointLoaderSimple',
        pos: [661.4085829118969, 586.8729054837115],
        size: {
          '0': 670,
          '1': 100,
        },
        flags: {},
        order: 1,
        mode: 0,
        outputs: [
          {
            links: [5],
            name: 'MODEL',
            shape: 3,
            slot_index: 0,
            type: 'MODEL',
          },
          {
            links: [1, 10],
            name: 'CLIP',
            shape: 3,
            slot_index: 1,
            type: 'CLIP',
          },
          {
            links: [9],
            name: 'VAE',
            shape: 3,
            slot_index: 2,
            type: 'VAE',
          },
        ],
        properties: {
          'Node name for S&R': 'CheckpointLoaderSimple',
        },
        widgets_values: ['NewRealityXL12 ❗ All-In-One Photographic/newrealityxlAllInOne_21.safetensors'],
      },
      {
        id: 7,
        type: 'CLIPTextEncode',
        pos: [2265.408582911897, 1214.8729054837136],
        size: {
          '0': 490,
          '1': 270,
        },
        flags: {},
        order: 3,
        mode: 0,
        inputs: [
          {
            link: 10,
            name: 'clip',
            type: 'CLIP',
          },
        ],
        outputs: [
          {
            links: [4],
            name: 'CONDITIONING',
            shape: 3,
            slot_index: 0,
            type: 'CONDITIONING',
          },
        ],
        properties: {
          'Node name for S&R': 'CLIPTextEncode',
        },
        widgets_values: [
          '(high contrast, over saturated, glossy:1.1), (cartoon, 3d, 3d render, Photoshop, sketch, sketches, video game, draw, paint, painting, render, cgi, computer graphics, anime, manga, 2d art, 3d art, illustration:1.1), (canvas frame, watermark, signature, username, artist name:1.1),lowres, error, cropped, worst quality, low quality, jpeg artifacts, out of frame, watermark, signature, , deformed, ugly, mutilated, disfigured, text, extra limbs, face cut, head cut, extra fingers, extra arms, poorly drawn face, mutation, bad proportions, cropped head, malformed limbs, mutated hands, fused fingers, long neck, lowres, error, cropped, worst quality, low quality, jpeg artifacts, out of frame, watermark, signature, illustration, painting, drawing, art, sketch',
        ],
        color: '#322',
        bgcolor: '#533',
      },
      {
        id: 6,
        type: 'CLIPTextEncode',
        pos: [1708, 1291],
        size: {
          '0': 490,
          '1': 270,
        },
        flags: {},
        order: 2,
        mode: 0,
        inputs: [
          {
            link: 1,
            name: 'clip',
            type: 'CLIP',
          },
        ],
        outputs: [
          {
            links: [3],
            name: 'CONDITIONING',
            shape: 3,
            slot_index: 0,
            type: 'CONDITIONING',
          },
        ],
        properties: {
          'Node name for S&R': 'CLIPTextEncode',
        },
        widgets_values: [
          'A detailed chalk pastel of a dog wearing Trump clothes on the streets of cyberpunk toyko japan, high res, natural lighting, fun atmosphere, grunge',
        ],
        color: '#232',
        bgcolor: '#353',
      },
      {
        id: 10,
        type: 'SaveImage',
        pos: [1760, 570],
        size: {
          '0': 1000,
          '1': 580,
        },
        flags: {},
        order: 6,
        mode: 0,
        inputs: [
          {
            link: 7,
            name: 'images',
            type: 'IMAGE',
          },
        ],
        properties: {},
        widgets_values: ['image'],
      },
    ],
    links: [
      [1, 1, 1, 6, 0, 'CLIP'],
      [2, 2, 0, 3, 3, 'LATENT'],
      [3, 6, 0, 3, 1, 'CONDITIONING'],
      [4, 7, 0, 3, 2, 'CONDITIONING'],
      [5, 1, 0, 3, 0, 'MODEL'],
      [7, 8, 0, 10, 0, 'IMAGE'],
      [8, 3, 0, 8, 0, 'LATENT'],
      [9, 1, 2, 8, 1, 'VAE'],
      [10, 1, 1, 7, 0, 'CLIP'],
    ],
    groups: [],
    config: {},
    extra: {
      '0246.VERSION': [0, 0, 4],
    },
    version: 0.4,
  },
});


export const examplePrompt3 = JSON.stringify({
  prompt: {
    last_node_id: 14,
    last_link_id: 10,
    nodes: [
      {
        id: 8,
        type: 'VAEDecode',
        pos: [1305.6273329118997, 589.0916554837115],
        size: {
          '0': 320,
          '1': 50,
        },
        flags: {},
        order: 5,
        mode: 0,
        inputs: [
          {
            link: 8,
            name: 'samples',
            type: 'LATENT',
          },
          {
            link: 9,
            name: 'vae',
            type: 'VAE',
          },
        ],
        outputs: [
          {
            links: [7],
            name: 'IMAGE',
            shape: 3,
            slot_index: 0,
            type: 'IMAGE',
          },
        ],
        properties: {
          'Node name for S&R': 'VAEDecode',
        },
      },
      {
        id: 3,
        type: 'KSamplerAdvanced //Inspire',
        pos: [1405.6273329118997, 678.1783177358948],
        size: {
          '0': 320,
          '1': 450,
        },
        flags: {},
        order: 4,
        mode: 0,
        inputs: [
          {
            link: 5,
            name: 'model',
            type: 'MODEL',
          },
          {
            link: 3,
            name: 'positive',
            type: 'CONDITIONING',
          },
          {
            link: 4,
            name: 'negative',
            type: 'CONDITIONING',
          },
          {
            link: 2,
            name: 'latent_image',
            type: 'LATENT',
          },
          {
            link: null,
            name: 'noise_opt',
            type: 'NOISE',
          },
        ],
        outputs: [
          {
            links: [8],
            name: 'LATENT',
            shape: 3,
            slot_index: 0,
            type: 'LATENT',
          },
        ],
        properties: {
          'Node name for S&R': 'KSamplerAdvanced //Inspire',
        },
        widgets_values: [
          true,
          1017770969198960,
          'randomize',
          43,
          6,
          'dpmpp_3m_sde_gpu',
          'exponential',
          0,
          10000,
          'GPU(=A1111)',
          false,
          'comfy',
          0,
          0,
        ],
      },
      {
        id: 2,
        type: 'SDXL Empty Latent Image (rgthree)',
        pos: [671.4085829118969, 746.8729054837113],
        size: {
          '0': 670,
          '1': 150,
        },
        flags: {},
        order: 0,
        mode: 0,
        outputs: [
          {
            links: [2],
            name: 'LATENT',
            shape: 3,
            slot_index: 0,
            type: 'LATENT',
          },
          {
            links: null,
            name: 'CLIP_WIDTH',
            shape: 3,
            type: 'INT',
          },
          {
            links: null,
            name: 'CLIP_HEIGHT',
            shape: 3,
            type: 'INT',
          },
        ],
        properties: {
          'Node name for S&R': 'SDXL Empty Latent Image (rgthree)',
        },
        widgets_values: [' 896 x 1152  (portrait xD)', 2, 1],
      },
      {
        id: 1,
        type: 'CheckpointLoaderSimple',
        pos: [661.4085829118969, 586.8729054837115],
        size: {
          '0': 670,
          '1': 100,
        },
        flags: {},
        order: 1,
        mode: 0,
        outputs: [
          {
            links: [5],
            name: 'MODEL',
            shape: 3,
            slot_index: 0,
            type: 'MODEL',
          },
          {
            links: [1, 10],
            name: 'CLIP',
            shape: 3,
            slot_index: 1,
            type: 'CLIP',
          },
          {
            links: [9],
            name: 'VAE',
            shape: 3,
            slot_index: 2,
            type: 'VAE',
          },
        ],
        properties: {
          'Node name for S&R': 'CheckpointLoaderSimple',
        },
        widgets_values: ['NewRealityXL123 ❗ All-In-One Photographic/newrealityxlAllInOne_21.safetensors'],
      },
      {
        id: 7,
        type: 'CLIPTextEncode',
        pos: [2265.408582911897, 1214.8729054837136],
        size: {
          '0': 490,
          '1': 270,
        },
        flags: {},
        order: 3,
        mode: 0,
        inputs: [
          {
            link: 10,
            name: 'clip',
            type: 'CLIP',
          },
        ],
        outputs: [
          {
            links: [4],
            name: 'CONDITIONING',
            shape: 3,
            slot_index: 0,
            type: 'CONDITIONING',
          },
        ],
        properties: {
          'Node name for S&R': 'CLIPTextEncode',
        },
        widgets_values: [
          '(high contrast, over saturated, glossy:1.1), (cartoon, 3d, 3d render, Photoshop, sketch, sketches, video game, draw, paint, painting, render, cgi, computer graphics, anime, manga, 2d art, 3d art, illustration:1.1), (canvas frame, watermark, signature, username, artist name:1.1),lowres, error, cropped, worst quality, low quality, jpeg artifacts, out of frame, watermark, signature, , deformed, ugly, mutilated, disfigured, text, extra limbs, face cut, head cut, extra fingers, extra arms, poorly drawn face, mutation, bad proportions, cropped head, malformed limbs, mutated hands, fused fingers, long neck, lowres, error, cropped, worst quality, low quality, jpeg artifacts, out of frame, watermark, signature, illustration, painting, drawing, art, sketch',
        ],
        color: '#322',
        bgcolor: '#533',
      },
      {
        id: 6,
        type: 'CLIPTextEncode',
        pos: [1708, 1291],
        size: {
          '0': 490,
          '1': 270,
        },
        flags: {},
        order: 2,
        mode: 0,
        inputs: [
          {
            link: 1,
            name: 'clip',
            type: 'CLIP',
          },
        ],
        outputs: [
          {
            links: [3],
            name: 'CONDITIONING',
            shape: 3,
            slot_index: 0,
            type: 'CONDITIONING',
          },
        ],
        properties: {
          'Node name for S&R': 'CLIPTextEncode',
        },
        widgets_values: [
          'A detailed chalk pastel of a dog wearing Trump clothes on the streets of cyberpunk toyko japan, high res, natural lighting, fun atmosphere, grunge',
        ],
        color: '#232',
        bgcolor: '#353',
      },
      {
        id: 10,
        type: 'SaveImage',
        pos: [1760, 570],
        size: {
          '0': 1000,
          '1': 580,
        },
        flags: {},
        order: 6,
        mode: 0,
        inputs: [
          {
            link: 7,
            name: 'images',
            type: 'IMAGE',
          },
        ],
        properties: {},
        widgets_values: ['image'],
      },
    ],
    links: [
      [1, 1, 1, 6, 0, 'CLIP'],
      [2, 2, 0, 3, 3, 'LATENT'],
      [3, 6, 0, 3, 1, 'CONDITIONING'],
      [4, 7, 0, 3, 2, 'CONDITIONING'],
      [5, 1, 0, 3, 0, 'MODEL'],
      [7, 8, 0, 10, 0, 'IMAGE'],
      [8, 3, 0, 8, 0, 'LATENT'],
      [9, 1, 2, 8, 1, 'VAE'],
      [10, 1, 1, 7, 0, 'CLIP'],
    ],
    groups: [],
    config: {},
    extra: {
      '0246.VERSION': [0, 0, 4],
    },
    version: 0.4,
  },
});
