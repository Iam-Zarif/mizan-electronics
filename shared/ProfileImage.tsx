import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

const ProfileImage = memo(() => (
  <Link href="/profile" className="cursor-pointer">
    <Image
      src="https://i.ibb.co/67fpNVMH/profile.jpg"
      alt="Profile"
      width={40}
      height={40}
      className="rounded-full object-cover object-center"
    />
  </Link>
));

export default ProfileImage;
