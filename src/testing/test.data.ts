const total = 117673;
const limit = 3;
const offset = 30;
const totalPages = 39225;
const page = 11;
const iiifUrl = 'https:\/\/www.artic.edu\/iiif\/2';
const imageSpecPath = 'full/843,/0/default.jpg';

const artworkData = {
  art1: {
    title: 'Pair of Candelabra',
    start: 1920,
    end: 1921,
    origin: 'United States',
    medium: 'Silver',
    artist: 'Kalo Shop (Firm)',
    styles: ['Modernism', 'Arts and Crafts Movement', 'American Arts and Crafts Movement'],
    imageId: 'd804347a-eada-d3df-96b7-2b528727fe9f'
  },
  art2: {
    title: 'Cocktail Shaker',
    start: 1931,
    end: 1931,
    origin: 'New York',
    medium: 'Silver',
    artist: 'Peer Smed',
    styles: ['Modernism', 'Art Deco'],
    imageId: 'd79d875e-4094-8127-a2a9-487d1b08f389'
  },
  art3: {
    title: 'The Three Skulls',
    start: null,
    end: null,
    origin: 'France',
    medium: 'Watercolor, with graphite, on ivory wove paper',
    artist: 'Paul Cezanne',
    styles: [],
    imageId: '655a168b-7f9d-be19-615a-eb63adf20e7b'
  }
} as const;

export const testArtworkApiResponse: any = {
  pagination: {
    total,
    limit,
    offset,
    total_pages: totalPages,
    current_page: page,
  },
  data: [
    {
      title: artworkData.art1.title,
      date_start: artworkData.art1.start,
      date_end: artworkData.art1.end,
      place_of_origin: artworkData.art1.origin,
      medium_display: artworkData.art1.medium,
      artist_title: artworkData.art1.artist,
      style_titles: artworkData.art1.styles,
      image_id: artworkData.art1.imageId
    },
    {
      title: artworkData.art2.title,
      date_start: artworkData.art2.start,
      date_end: artworkData.art2.end,
      place_of_origin: artworkData.art2.origin,
      medium_display: artworkData.art2.medium,
      artist_title: artworkData.art2.artist,
      style_titles: artworkData.art2.styles,
      image_id: artworkData.art2.imageId
    },
    {
      title: artworkData.art3.title,
      date_start: artworkData.art3.start,
      date_end: artworkData.art3.end,
      place_of_origin: artworkData.art3.origin,
      medium_display: artworkData.art3.medium,
      artist_title: artworkData.art3.artist,
      style_titles: artworkData.art3.styles,
      image_id: artworkData.art3.imageId
    }
  ],
  config: {
    iiif_url: iiifUrl
  }
} as const;

export const testArtworkResult: any = {
  total,
  page,
  artworks: [
    {
      title: artworkData.art1.title,
      artist: artworkData.art1.artist,
      origin: artworkData.art1.origin,
      startYear: artworkData.art1.start,
      endYear: artworkData.art1.end,
      medium: artworkData.art1.medium,
      styles: artworkData.art1.styles,
      imageUrl: `${iiifUrl}/${artworkData.art1.imageId}/${imageSpecPath}`
    },
    {
      title: artworkData.art2.title,
      artist: artworkData.art2.artist,
      origin: artworkData.art2.origin,
      startYear: artworkData.art2.start,
      endYear: artworkData.art2.end,
      medium: artworkData.art2.medium,
      styles: artworkData.art2.styles,
      imageUrl: `${iiifUrl}/${artworkData.art2.imageId}/${imageSpecPath}`
    },
    {
      title: artworkData.art3.title,
      artist: artworkData.art3.artist,
      origin: artworkData.art3.origin,
      startYear: artworkData.art3.start,
      endYear: artworkData.art3.end,
      medium: artworkData.art3.medium,
      styles: artworkData.art3.styles,
      imageUrl: `${iiifUrl}/${artworkData.art3.imageId}/${imageSpecPath}`
    },
  ]
} as const;
