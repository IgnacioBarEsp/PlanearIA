// Fixture: la entrada autorizada ya NO lee la primitiva. La autorizacion sobra
// y debe retirarse. Es la invariante que ninguna regla de lint puede ver: su
// silencio seria indistinguible del exito.
export function useAnchoFixture(): number {
  return 1024;
}
