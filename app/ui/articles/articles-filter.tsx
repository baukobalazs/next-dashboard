// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { Tag } from "@/app/lib/definitions";
// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import Chip from "@mui/material/Chip";
// import InputAdornment from "@mui/material/InputAdornment";
// import SearchIcon from "@mui/icons-material/Search";
// import { useDebouncedCallback } from "use-debounce";

// type ArticlesFilterProps = {
//   tags: Tag[];
// };

// export default function ArticlesFilter({ tags }: ArticlesFilterProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [searchQuery, setSearchQuery] = useState(
//     searchParams.get("query") || ""
//   );
//   const selectedTag = searchParams.get("tag") || "";

//   const handleSearch = useDebouncedCallback((term: string) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", "1");

//     if (term) {
//       params.set("query", term);
//     } else {
//       params.delete("query");
//     }

//     router.replace(`${pathname}?${params.toString()}`);
//   }, 300);

//   const handleTagClick = (slug: string) => {
//     const params = new URLSearchParams(searchParams);
//     params.set("page", "1");

//     if (selectedTag === slug) {
//       params.delete("tag");
//     } else {
//       params.set("tag", slug);
//     }

//     router.replace(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <Box sx={{ mb: 4 }}>
//       <TextField
//         fullWidth
//         placeholder="Keresés..."
//         value={searchQuery}
//         onChange={(e) => {
//           setSearchQuery(e.target.value);
//           handleSearch(e.target.value);
//         }}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <SearchIcon />
//             </InputAdornment>
//           ),
//         }}
//         sx={{ mb: 3 }}
//       />

//       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//         {tags.map((tag) => (
//           <Chip
//             key={tag.id}
//             label={tag.name}
//             onClick={() => handleTagClick(tag.slug)}
//             color={selectedTag === tag.slug ? "primary" : "default"}
//             variant={selectedTag === tag.slug ? "filled" : "outlined"}
//             sx={{ cursor: "pointer" }}
//           />
//         ))}
//       </Box>
//     </Box>
//   );
// }
