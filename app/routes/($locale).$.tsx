import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import Custom404 from '../components/Custom404';

export async function loader({request}: LoaderFunctionArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return (
    <>
      <Custom404 />
    </>
  );
}
