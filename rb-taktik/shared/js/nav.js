function goPage(path)
{
    history.pushState({}, "", path);
    window.location.assign(path);
}