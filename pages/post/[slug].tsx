import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import Head from "next/head";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };

  return (
    <>
      <main>
        <Head>
          <title>{post.title}</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="title" content={`${post.title}`}></meta>
          <meta name="description" content={`${post.title}`}></meta>
          <meta property="og:type" content="article" />
          <meta property="og:title" content={`${post.title}`} />
          <meta property="og:description" content={`${post.title}`} />
          <meta property="og:image" content={`${post.mainImage}`} />
        </Head>
        <Header />
        <img
          className="w-full h-40 object-cover"
          src={urlFor(post.mainImage).url()!}
          alt=""
        />

        <article className="max-w-7xl mx-auto p-5">
          <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
          <h2 className="text-xl font-light text-gray-500 mb-2">
            {post.description}
          </h2>

          <div className="flex items-center space-x-2">
            <img
              className="w-10 h-10 rounded-full"
              src={urlFor(post.author.image).url()!}
              alt=""
            />
            <p className="font-extralight text-sm">
              Blog Post by{" "}
              <span className="text-green-600">{post.author.name} </span>-
              Published at {new Date(post._createAt).toLocaleString()}
            </p>
          </div>

          <div className="mt-10">
            <PortableText
              className=""
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
              content={post.body}
              serializers={{
                h1: (props: any) => (
                  <h1 className="text-2xl font-bold my-5" {...props} />
                ),
                h2: (props: any) => (
                  <h1 className="text-xl font-bold my-5" {...props} />
                ),
                img: (props: any) => (
                  <img className="mx-auto items-center" {...props} />
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>

        <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

        {submitted ? (
          <div className="flex flex-col p-10 border bg-yellow-500 text-white max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold">
              Thank you for submitting your comment!
            </h3>
            <p>Once it has been approved, it will appear below!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          >
            <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
            <h4 className="text-3xl font-bold">Leave a comment below!</h4>

            <hr className="py-3 mt-2" />

            <input
              {...register("_id")}
              name="_id"
              value={post._id}
              type="hidden"
            />

            <label className="block mb-5">
              <span className="text-gray-700">Name</span>
              <input
                {...register("name", { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                type="text"
                placeholder="Sahinur Islam"
              />
              {errors.name && (
                <span className="text-red-500">
                  - This Name Field is required
                </span>
              )}
            </label>
            <label className="block mb-5">
              <span className="text-gray-700">Email</span>
              <input
                {...register("email", { required: true })}
                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                type="text"
                placeholder="your@gamil.com"
              />
            </label>
            {errors.email && (
              <span className="text-red-500">
                - This Email Field is required
              </span>
            )}
            <label className="block mb-5">
              <span className="text-gray-700">Comment</span>
              <textarea
                {...register("comment", { required: true })}
                className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                placeholder="Enter some long text"
                rows={8}
              />
            </label>
            {errors.comment && (
              <span className="text-red-500">
                - This Comment Field is required
              </span>
            )}

            <input
              type="submit"
              className="shadow mt-4 bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
            />
          </form>
        )}
        {post.comments.length >= 1 && (
          <div className="flex flex-col p-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
            <h3 className=" text-4xl">Comments</h3>
            <hr className="pb-2" />
            {post.comments.map((c) => (
              <div key={c._id}>
                <p>
                  {" "}
                  <span className="text-yellow-500">{c.name}:</span> {c.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
        current
        }
      }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
       _createAt,
        title,
        author-> {
        name,
        image
      },
      'comments': *[
        _type == 'comment' &&
        post._ref == ^._id &&
        approved == true],
      description,
      slug,
      mainImage,
      body
    }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // after 60 seconds itll update the old cached version
  };
};
