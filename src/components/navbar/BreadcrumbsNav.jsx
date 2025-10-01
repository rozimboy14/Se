import { useLocation, useSearchParams, Link, matchPath } from "react-router-dom";
import { Breadcrumbs, Typography, Box, Link as MLink } from "@mui/material";
import { breadcrumbTree, flattenBreadcrumbTree } from "./breadcrumbConfig";

const breadcrumbList = flattenBreadcrumbTree(breadcrumbTree);

function BreadcrumbsNav() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const getMatchedBreadcrumb = (fullPath) => {
    const matches = breadcrumbList.filter((b) => matchPath({ path: b.path, end: false }, fullPath));
    return matches.sort((a, b) => b.path.length - a.path.length)[0];
  };
  console.log(searchParams);
  const usedMatchedPaths = new Set();
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }} className="custom-breadcrumbs">
      {pathnames.map((_, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");
        const matched = getMatchedBreadcrumb(to);

        if (!matched || usedMatchedPaths.has(matched.path)) return null;
        usedMatchedPaths.add(matched.path);

        const title = matched.getTitle
          ? matched.getTitle(null, searchParams)
          : matched.title || decodeURIComponent(pathnames[index]);

        if (!title || matched.hideInBreadcrumb) return null;

        const icon = matched.icon || null;
        const content = (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {icon}
            <span>{title}</span>
          </Box>
        );

        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography key={to} color="text.primary" component="span">
            {content}
          </Typography>
        ) : (
          <MLink
            key={to}
            component={Link}
            underline="hover"
            color="inherit"
            to={to + location.search}
          >
            {content}
          </MLink>
        );
      })}
    </Breadcrumbs>
  );
}
export default BreadcrumbsNav;
