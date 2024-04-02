/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  id = 'aside',
}: {
  children?: React.ReactNode;
  heading: React.ReactNode;
  id?: string;
}) {
  return (
    <div aria-modal className="overlay max-w-full" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          history.go(-1);
          window.location.hash = '';
        }}
      />
      <aside className="flex flex-col max-w-full mt-28 lg:mt-[7.5rem]">
        <header>
          <h3 className="font-bold text-xl">{heading}</h3>
          <CloseAside />
        </header>
        <main className="transition-all duration-300 ease-in-out">
          {children}
        </main>
      </aside>
    </div>
  );
}

function CloseAside() {
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a
      className="font-semibold italic text-xl text-center overflow-hidden px-2 py-0.5 outline outline-2 outline-black bg-red-500 rounded-md active:animate-ping hover:scale-105 transition-all duration-150 ease-in-out"
      href="#"
      onChange={() => history.go(-1)}
    >
      Close
    </a>
  );
}
