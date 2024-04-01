export default function mofidshim({
    src,
    width,
    quality,
  }: {
    src: string
    width: number
    quality?: number
  }) {
    return `http://mofidshim.ir${src}`
  }
  